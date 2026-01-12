import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    Pressable,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Platform,
} from "react-native";
import { X, FileText, Sparkles, Copy, Check } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { Job } from "../types";
import { generateTailoredResume } from "../services/gemini";
import { useAuth } from "../context/AuthContext";
import Colors from "../constants/Colors";

interface ResumeModalProps {
    visible: boolean;
    onClose: () => void;
    jobTitle: string;
    company: string;
}

export default function ResumeModal({
    visible,
    onClose,
    jobTitle,
    company,
}: ResumeModalProps) {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (visible && user?.resume) {
            handleGenerate();
        } else if (visible && !user?.resume) {
            Alert.alert(
                "Resume Required",
                "Please upload your base resume in the search form first to use this feature."
            );
            onClose();
        }
    }, [visible]);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            // Create a dummy job object for the service
            const dummyJob: any = {
                title: jobTitle,
                company: company,
                requirements: [],
                description: `Targeting position at ${company}`,
            };

            const tailored = await generateTailoredResume(dummyJob, {
                mimeType: user!.resume!.mimeType,
                base64: user!.resume!.base64,
            });
            setContent(tailored);
        } catch (error) {
            console.error("Failed to generate resume:", error);
            Alert.alert("Error", "Failed to generate tailored resume.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!content) {
            return;
        }
        try {
            await Clipboard.setStringAsync(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            Alert.alert("Error", "Failed to copy to clipboard.");
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTitleRow}>
                        <View style={styles.iconBox}>
                            <Sparkles color={Colors.secondary} size={20} />
                        </View>
                        <View>
                            <Text style={styles.title}>Tailored Strategy</Text>
                            <Text style={styles.subtitle} numberOfLines={1}>
                                {jobTitle} @ {company}
                            </Text>
                        </View>
                    </View>
                    <Pressable onPress={onClose} style={styles.closeBtn}>
                        <X color={Colors.accent} size={24} />
                    </Pressable>
                </View>

                {/* Content */}
                {isLoading ? (
                    <View style={styles.loadingState}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>
                            Resumator Agent is analyzing keywords and highlighting your strengths...
                        </Text>
                    </View>
                ) : (
                    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.resumeCard}>
                            <View style={styles.cardHeader}>
                                <FileText color={Colors.primary} size={16} />
                                <Text style={styles.cardLabel}>STRATEGIC DRAFT</Text>
                                <Pressable onPress={handleCopy} style={styles.copyBtn}>
                                    {copied ? (
                                        <Check color={Colors.success} size={18} />
                                    ) : (
                                        <Copy color={Colors.primary} size={18} />
                                    )}
                                </Pressable>
                            </View>
                            <View style={styles.contentBox}>
                                <Text style={styles.contentText}>
                                    {content || "Generating content..."}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.tipCard}>
                            <Sparkles color={Colors.secondary} size={16} />
                            <Text style={styles.tipText}>
                                <Text style={styles.tipBold}>Pro Tip:</Text> This draft is optimized for ATS readability. Review for accuracy before submitting.
                            </Text>
                        </View>

                        <View style={styles.spacer} />
                    </ScrollView>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(179, 143, 111, 0.1)",
        backgroundColor: Colors.secondary,
    },
    headerTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    iconBox: {
        backgroundColor: Colors.primary,
        padding: 8,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.textLight,
        fontFamily: "PTSerif_400Regular",
        maxWidth: 200,
    },
    closeBtn: {
        padding: 8,
    },
    loadingState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    loadingText: {
        marginTop: 20,
        textAlign: "center",
        color: Colors.textLight,
        lineHeight: 22,
        fontFamily: "PTSerif_400Regular",
    },
    scroll: {
        flex: 1,
        padding: 20,
    },
    resumeCard: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(179, 143, 111, 0.1)",
        gap: 10,
    },
    cardLabel: {
        fontSize: 10,
        fontFamily: "PTSerif_700Bold",
        color: Colors.primary,
        letterSpacing: 1,
        flex: 1,
    },
    copyBtn: {
        padding: 4,
    },
    contentBox: {
        padding: 20,
    },
    contentText: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 22,
        fontFamily: "PTSerif_400Regular",
    },
    tipCard: {
        marginTop: 20,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        padding: 16,
        borderRadius: 16,
        flexDirection: "row",
        gap: 12,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
    },
    tipText: {
        flex: 1,
        fontSize: 13,
        color: Colors.text,
        lineHeight: 20,
        fontFamily: "PTSerif_400Regular",
    },
    tipBold: {
        fontFamily: "PTSerif_700Bold",
    },
    spacer: {
        height: 40,
    },
});
