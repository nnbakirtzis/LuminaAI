import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ActivityIndicator,
    Alert,
    Switch,
    StyleSheet,
    Platform,
} from "react-native";
import * as Location from "expo-location";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Slider } from "@miblanchard/react-native-slider";
import {
    Briefcase,
    MapPin,
    Upload,
    FileText,
    X,
    TrendingUp,
    Navigation,
    ChevronDown,
    Check,
} from "lucide-react-native";
import { UserPreferences } from "../types";
import Colors from "../constants/Colors";
import { useAuth } from "../context/AuthContext";
import ScalePressable from "./ScalePressable";
import { supabase } from "../services/supabase";
import { ResumeManager } from "../utils/resumeManager";

interface PreferenceFormProps {
    onSubmit: (prefs: UserPreferences) => void;
    isLoading: boolean;
}

const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Executive"] as const;

export default function PreferenceForm({
    onSubmit,
    isLoading,
}: PreferenceFormProps) {
    const { user, updateUser } = useAuth();
    const [prefs, setPrefs] = useState<UserPreferences>({
        jobTitle: "",
        location: "",
        experienceLevel: "Mid",
        salaryMin: 80,
        salaryMax: 180,
        workMode: "Remote",
        employmentType: "Full-time",
        keySkills: "",
        resume: undefined,
        enableIntelligence: false,
        enableResumeTailoring: false,
    });

    const [isLocating, setIsLocating] = useState(false);
    const [showExpDropdown, setShowExpDropdown] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load profile from Supabase on mount
    useEffect(() => {
        if (!user) return;

        const loadProfile = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data && !error) {
                setPrefs((prev) => ({
                    ...prev,
                    jobTitle: data.job_title || prev.jobTitle,
                    location: data.location || prev.location,
                    experienceLevel: (data.experience_level as any) || prev.experienceLevel,
                    salaryMin: data.salary_min || prev.salaryMin,
                    salaryMax: data.salary_max || prev.salaryMax,
                    workMode: (data.work_mode as any) || prev.workMode,
                    employmentType: (data.employment_type as any) || prev.employmentType,
                    key_skills: data.key_skills || prev.keySkills,
                    enableIntelligence: data.enable_intelligence ?? prev.enableIntelligence,
                    enableResumeTailoring: data.enable_resume_tailoring ?? prev.enableResumeTailoring,
                    resume: data.resume_path ? {
                        fileName: data.resume_path.split('/').pop() || "Resume",
                        mimeType: "application/pdf", // Default, could be refined
                        storagePath: data.resume_path
                    } : prev.resume,
                }));
            }
        };

        loadProfile();
    }, [user]);

    const saveProfile = async (updatedPrefs: UserPreferences) => {
        if (!user) return;
        setIsSaving(true);
        try {
            const { error } = await supabase.from("profiles").upsert({
                id: user.id,
                job_title: updatedPrefs.jobTitle,
                location: updatedPrefs.location,
                experience_level: updatedPrefs.experienceLevel,
                salary_min: updatedPrefs.salaryMin,
                salary_max: updatedPrefs.salaryMax,
                work_mode: updatedPrefs.workMode,
                employment_type: updatedPrefs.employmentType,
                key_skills: updatedPrefs.keySkills,
                enable_intelligence: updatedPrefs.enableIntelligence,
                enable_resume_tailoring: updatedPrefs.enableResumeTailoring,
                resume_path: updatedPrefs.resume?.storagePath,
                updated_at: new Date().toISOString(),
            });

            if (error) throw error;
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!prefs.jobTitle || !prefs.location) {
            Alert.alert("Missing Info", "Please enter a job title and location.");
            return;
        }
        await saveProfile(prefs);
        onSubmit(prefs);
    };

    const handleLocateMe = async () => {
        setIsLocating(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Location access is required.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const [address] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (address) {
                const parts = [address.city, address.region, address.country].filter(Boolean);
                setPrefs((prev) => ({ ...prev, location: parts.join(", ") }));
            }
        } catch (error) {
            Alert.alert("Error", "Failed to get location.");
        } finally {
            setIsLocating(false);
        }
    };

    const handlePickDocument = async () => {
        if (!user) {
            Alert.alert("Authentication Required", "Please sign in to upload a resume.");
            return;
        }

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/pdf", "text/plain"],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                const file = result.assets[0];
                setIsSaving(true);

                // 1. Upload to Supabase Storage (RLS Folder: {user_id}/{filename})
                const storagePath = `${user.id}/${file.name}`;

                const formData = new FormData();
                formData.append('file', {
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType || 'application/pdf',
                } as any);

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(storagePath, formData, {
                        upsert: true,
                    });

                if (uploadError) throw uploadError;

                // 2. Cache locally and remove base64 from memory
                const base64 = await FileSystem.readAsStringAsync(file.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                await ResumeManager.cacheResume(storagePath, base64);

                const resumeData = {
                    fileName: file.name,
                    mimeType: file.mimeType || "application/pdf",
                    storagePath: storagePath
                };

                setPrefs((prev) => ({
                    ...prev,
                    resume: resumeData,
                    enableResumeTailoring: true,
                }));

                updateUser({ resume: resumeData });

                // 3. Save path to profile
                await supabase.from("profiles").upsert({
                    id: user.id,
                    resume_path: storagePath,
                    enable_resume_tailoring: true,
                    updated_at: new Date().toISOString(),
                });
            }
        } catch (error: any) {
            console.error("Resume Upload Error:", error);
            Alert.alert("Error", `Failed to upload resume: ${error.message || "Unknown error"}`);
        } finally {
            setIsSaving(false);
        }
    };

    const removeFile = () => {
        setPrefs((prev) => ({
            ...prev,
            resume: undefined,
            enableResumeTailoring: false,
        }));
        updateUser({ resume: undefined });
    };

    return (
        <View style={styles.card}>
            {/* Job Title */}
            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Briefcase color={Colors.primary} size={14} />
                    <Text style={styles.label}>DESIRED ROLE</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Senior Product Designer"
                    placeholderTextColor="#94a3b8"
                    value={prefs.jobTitle}
                    onChangeText={(text) =>
                        setPrefs((prev) => ({ ...prev, jobTitle: text }))
                    }
                />
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <MapPin color={Colors.primary} size={14} />
                    <Text style={styles.label}>LOCATION</Text>
                </View>
                <View style={styles.locationWrapper}>
                    <TextInput
                        style={[styles.input, { paddingRight: 50 }]}
                        placeholder="e.g. Austin, TX"
                        placeholderTextColor="#94a3b8"
                        value={prefs.location}
                        onChangeText={(text) =>
                            setPrefs((prev) => ({ ...prev, location: text }))
                        }
                    />
                    <ScalePressable
                        onPress={handleLocateMe}
                        disabled={isLocating}
                        style={styles.locateBtn}
                    >
                        {isLocating ? (
                            <ActivityIndicator size="small" color={Colors.primary} />
                        ) : (
                            <Navigation color={Colors.primary} size={20} />
                        )}
                    </ScalePressable>
                </View>
            </View>

            {/* Experience Level */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>EXPERIENCE</Text>
                <ScalePressable
                    onPress={() => setShowExpDropdown(!showExpDropdown)}
                    style={styles.dropdown}
                >
                    <Text style={styles.dropdownText}>{prefs.experienceLevel}</Text>
                    <ChevronDown
                        color={Colors.accent}
                        size={18}
                        style={{
                            transform: [{ rotate: showExpDropdown ? "180deg" : "0deg" }],
                        }}
                    />
                </ScalePressable>
            </View>

            {showExpDropdown && (
                <View style={styles.dropdownMenu}>
                    {EXPERIENCE_LEVELS.map((level) => (
                        <ScalePressable
                            key={level}
                            onPress={() => {
                                setPrefs((prev) => ({ ...prev, experienceLevel: level }));
                                setShowExpDropdown(false);
                            }}
                            style={styles.dropdownItem}
                            scaleTo={0.98}
                        >
                            <Text style={styles.dropdownItemText}>{level}</Text>
                            {prefs.experienceLevel === level && (
                                <Check color={Colors.primary} size={18} />
                            )}
                        </ScalePressable>
                    ))}
                </View>
            )}

            {/* Salary Range */}
            <View style={styles.inputGroup}>
                <View style={styles.salaryHeader}>
                    <Text style={styles.label}>SALARY RANGE (K)</Text>
                    <Text style={styles.salaryValue}>
                        ${prefs.salaryMin}k — ${prefs.salaryMax}k{prefs.salaryMax === 500 ? "+" : ""}
                    </Text>
                </View>

                {Platform.OS === "web" ? (
                    <View style={styles.salaryRow}>
                        <View style={styles.salaryInput}>
                            <Text style={styles.salaryLabel}>Min</Text>
                            <TextInput
                                style={styles.salaryField}
                                keyboardType="numeric"
                                value={String(prefs.salaryMin)}
                                onChangeText={(text) => {
                                    const val = parseInt(text) || 0;
                                    setPrefs((prev) => ({
                                        ...prev,
                                        salaryMin: Math.min(val, prev.salaryMax - 10),
                                    }));
                                }}
                            />
                        </View>
                        <View style={styles.salaryInput}>
                            <Text style={styles.salaryLabel}>Max</Text>
                            <TextInput
                                style={styles.salaryField}
                                keyboardType="numeric"
                                value={String(prefs.salaryMax)}
                                onChangeText={(text) => {
                                    const val = parseInt(text) || 0;
                                    setPrefs((prev) => ({
                                        ...prev,
                                        salaryMax: Math.max(val, prev.salaryMin + 10),
                                    }));
                                }}
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.sliderContainer}>
                        <Slider
                            value={[prefs.salaryMin, prefs.salaryMax]}
                            onValueChange={(values: any) => {
                                setPrefs((prev) => ({
                                    ...prev,
                                    salaryMin: Math.round(values[0]),
                                    salaryMax: Math.round(values[1]),
                                }));
                            }}
                            minimumValue={20}
                            maximumValue={500}
                            step={5}
                            thumbTintColor={Colors.primary}
                            minimumTrackTintColor={Colors.primary}
                            maximumTrackTintColor="rgba(179, 143, 111, 0.3)"
                            trackStyle={styles.sliderTrack}
                            thumbStyle={styles.sliderThumb}
                        />
                        <View style={styles.sliderLabels}>
                            <Text style={styles.sliderLabelText}>$20k</Text>
                            <Text style={styles.sliderLabelText}>$500k</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Resume Upload */}
            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Upload color={Colors.primary} size={14} />
                    <Text style={styles.label}>RESUME / CV</Text>
                </View>
                <ScalePressable
                    onPress={prefs.resume ? undefined : handlePickDocument}
                    style={[styles.uploadBox, prefs.resume && styles.uploadBoxActive]}
                    scaleTo={0.98}
                >
                    {prefs.resume ? (
                        <View style={styles.fileRow}>
                            <View style={styles.fileIcon}>
                                <FileText color={Colors.primary} size={18} />
                            </View>
                            <View style={styles.fileInfo}>
                                <Text style={styles.fileName} numberOfLines={1}>
                                    {prefs.resume.fileName}
                                </Text>
                                <Text style={styles.fileStatus}>READY FOR ANALYSIS</Text>
                            </View>
                            <ScalePressable onPress={removeFile} style={styles.removeBtn}>
                                <X color={Colors.error} size={18} />
                            </ScalePressable>
                        </View>
                    ) : (
                        <View style={styles.uploadPlaceholder}>
                            <Text style={styles.uploadText}>Upload PDF / TXT</Text>
                            <Text style={styles.uploadHint}>For personalized matching</Text>
                        </View>
                    )}
                </ScalePressable>
            </View>

            {/* Market Intelligence Toggle */}
            <ScalePressable
                onPress={() =>
                    setPrefs((prev) => ({
                        ...prev,
                        enableIntelligence: !prev.enableIntelligence,
                    }))
                }
                style={[
                    styles.toggleCard,
                    prefs.enableIntelligence && styles.toggleCardActive,
                ]}
                scaleTo={0.98}
            >
                <View style={styles.toggleHeader}>
                    <View
                        style={[
                            styles.toggleIcon,
                            prefs.enableIntelligence && styles.toggleIconActive,
                        ]}
                    >
                        <TrendingUp
                            color={prefs.enableIntelligence ? "#fff" : Colors.accent}
                            size={18}
                        />
                    </View>
                    <Switch
                        value={prefs.enableIntelligence}
                        onValueChange={(val) =>
                            setPrefs((prev) => ({ ...prev, enableIntelligence: val }))
                        }
                        trackColor={{ false: "#E2E8F0", true: Colors.secondary }}
                        thumbColor="#fff"
                    />
                </View>
                <Text
                    style={[
                        styles.toggleTitle,
                        prefs.enableIntelligence && styles.toggleTitleActive,
                    ]}
                >
                    Activate Market Intelligence
                </Text>
                <Text
                    style={[
                        styles.toggleSub,
                        prefs.enableIntelligence && styles.toggleSubActive,
                    ]}
                >
                    Economist & Futurist agents will analyze salary trends & market growth.
                </Text>
            </ScalePressable>

            {/* Submit Button */}
            <ScalePressable
                onPress={handleSubmit}
                disabled={isLoading}
                style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                scaleTo={0.95}
            >
                {isLoading ? (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator color={Colors.primary} size="small" />
                        <Text style={styles.submitText}>Strategizing...</Text>
                    </View>
                ) : (
                    <Text style={styles.submitText}>Deploy Agents</Text>
                )}
            </ScalePressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 32,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.1)",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputGroup: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
    },
    label: {
        fontSize: 10,
        fontFamily: "PTSerif_700Bold",
        color: Colors.primary,
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.text,
        fontFamily: "PTSerif_400Regular",
    },
    inputSmall: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: Colors.text,
        fontFamily: "PTSerif_400Regular",
    },
    locationWrapper: {
        position: "relative",
        justifyContent: "center",
    },
    locateBtn: {
        position: "absolute",
        right: 14,
        padding: 4,
    },
    dropdown: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropdownText: {
        fontSize: 14,
        color: Colors.text,
        fontFamily: "PTSerif_400Regular",
    },
    dropdownMenu: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.3)",
        borderRadius: 16,
        marginBottom: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8,
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(179, 143, 111, 0.1)",
    },
    dropdownItemText: {
        color: Colors.text,
        fontFamily: "PTSerif_400Regular",
        fontSize: 14,
    },
    salaryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    salaryValue: {
        color: Colors.primary,
        fontSize: 18,
        fontFamily: "PTSerif_700Bold",
    },
    salaryRow: {
        flexDirection: "row",
        gap: 12,
    },
    salaryInput: {
        flex: 1,
    },
    salaryLabel: {
        fontSize: 10,
        color: Colors.textLight,
        marginBottom: 6,
        fontFamily: "PTSerif_700Bold",
    },
    salaryField: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        textAlign: "center",
        color: Colors.primary,
        fontFamily: "PTSerif_700Bold",
        fontSize: 15,
    },
    sliderContainer: {
        paddingVertical: 10,
    },
    sliderTrack: {
        height: 8,
        borderRadius: 4,
    },
    sliderThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: Colors.secondary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    sliderLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    sliderLabelText: {
        fontSize: 11,
        color: Colors.textLight,
        fontFamily: "PTSerif_700Bold",
    },
    uploadBox: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "rgba(179, 143, 111, 0.4)",
        borderRadius: 16,
        padding: 16,
        backgroundColor: "rgba(179, 143, 111, 0.03)",
    },
    uploadBoxActive: {
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        borderColor: Colors.primary,
    },
    fileRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    fileIcon: {
        width: 40,
        height: 40,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
    },
    fileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    fileName: {
        fontSize: 14,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
    },
    fileStatus: {
        fontSize: 10,
        fontFamily: "PTSerif_700Bold",
        color: Colors.primary,
        marginTop: 2,
        letterSpacing: 0.5,
    },
    removeBtn: {
        padding: 8,
    },
    uploadPlaceholder: {
        alignItems: "center",
        paddingVertical: 4,
    },
    uploadText: {
        color: Colors.primary,
        fontSize: 14,
        fontFamily: "PTSerif_700Bold",
        textDecorationLine: "none",
    },
    uploadHint: {
        color: Colors.textLight,
        fontSize: 12,
        marginTop: 4,
        fontFamily: "PTSerif_400Regular",
    },
    toggleCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
    },
    toggleCardActive: {
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
    },
    toggleHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    toggleIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
    },
    toggleIconActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    toggleTitle: {
        fontFamily: "PTSerif_700Bold",
        fontSize: 15,
        color: Colors.text,
        letterSpacing: -0.3,
    },
    toggleTitleActive: {
        color: Colors.primary,
    },
    toggleSub: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 6,
        lineHeight: 18,
        fontFamily: "PTSerif_400Regular",
    },
    toggleSubActive: {
        color: "rgba(255, 255, 255, 0.7)",
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: 20,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
    },
    submitBtnDisabled: {
        backgroundColor: "rgba(179, 143, 111, 0.3)",
        opacity: 0.5,
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    submitText: {
        color: Colors.secondary,
        fontFamily: "PTSerif_700Bold",
        fontSize: 16,
        letterSpacing: 1,
        textTransform: "uppercase",
    },
});
