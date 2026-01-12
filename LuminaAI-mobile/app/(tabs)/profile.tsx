import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Colors from "../../constants/Colors";
import { User as UserIcon, Mail, Shield, CreditCard, ChevronRight, Save } from "lucide-react-native";
import ScalePressable from "../../components/ScalePressable";
import { updateUserProfile } from "../../services/auth";

/**
 * Profile management screen for LuminaAI.
 * Allows users to update their personal information and view account status.
 */
export default function ProfileScreen() {
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const [name, setName] = useState(user?.name || "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        if (!name.trim()) {
            Alert.alert("Error", "Name cannot be empty");
            return;
        }

        setIsSaving(true);
        try {
            // Update auth metadata via service
            await updateUserProfile({ name: name.trim() });

            // Update profile in AuthContext
            updateUser({ name: name.trim() });

            Alert.alert("Success", "Profile updated successfully");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
                <View style={styles.card}>
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <UserIcon color={Colors.primary} size={14} />
                            <Text style={styles.label}>FULL NAME</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Mail color={Colors.primary} size={14} />
                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                        </View>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={user.email}
                            editable={false}
                        />
                        <Text style={styles.inputHint}>Email cannot be changed</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ACCOUNT & BILLING</Text>
                <View style={styles.card}>
                    <ScalePressable 
                        style={styles.menuItem}
                        onPress={() => {
                            router.push("/pricing");
                        }}
                    >
                        <View style={styles.menuIconContainer}>
                            <CreditCard color={Colors.primary} size={20} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Subscription Plan</Text>
                            <Text style={styles.menuSubtitle}>Free Tier</Text>
                        </View>
                        <ChevronRight color={Colors.textLight} size={20} />
                    </ScalePressable>

                    <View style={styles.divider} />

                    <ScalePressable 
                        style={styles.menuItem}
                        onPress={() => {
                            router.push("/security");
                        }}
                    >
                        <View style={styles.menuIconContainer}>
                            <Shield color={Colors.primary} size={20} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Security & Password</Text>
                            <Text style={styles.menuSubtitle}>Manage your account safety</Text>
                        </View>
                        <ChevronRight color={Colors.textLight} size={20} />
                    </ScalePressable>
                </View>
            </View>

            <ScalePressable
                onPress={handleSave}
                disabled={isSaving}
                style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            >
                {isSaving ? (
                    <ActivityIndicator color={Colors.secondary} size="small" />
                ) : (
                    <>
                        <Save color={Colors.secondary} size={20} />
                        <Text style={styles.saveText}>SAVE CHANGES</Text>
                    </>
                )}
            </ScalePressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
        maxWidth: 600,
        alignSelf: "center",
        width: "100%",
    },
    header: {
        alignItems: "center",
        marginVertical: 32,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(179, 143, 111, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: Colors.primary,
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontFamily: "PTSerif_700Bold",
        color: Colors.primary,
    },
    userName: {
        fontSize: 24,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: "PTSerif_400Regular",
        color: Colors.textLight,
        marginTop: 4,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: "PTSerif_700Bold",
        color: Colors.primary,
        letterSpacing: 1.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.1)",
    },
    inputGroup: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 10,
        fontFamily: "PTSerif_700Bold",
        color: Colors.textLight,
        letterSpacing: 1,
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.text,
        fontFamily: "PTSerif_400Regular",
    },
    disabledInput: {
        opacity: 0.5,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    inputHint: {
        fontSize: 10,
        color: Colors.textLight,
        marginTop: 4,
        marginLeft: 4,
        fontStyle: "italic",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
    },
    menuSubtitle: {
        fontSize: 12,
        fontFamily: "PTSerif_400Regular",
        color: Colors.textLight,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        marginVertical: 4,
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        gap: 12,
        marginTop: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveText: {
        color: Colors.secondary,
        fontFamily: "PTSerif_700Bold",
        fontSize: 16,
        letterSpacing: 1,
    },
});
