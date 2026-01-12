import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";
import Colors from "../../constants/Colors";
import { Shield, Key, Lock, Eye, ChevronRight } from "lucide-react-native";
import ScalePressable from "../../components/ScalePressable";

/**
 * Security management screen for LuminaAI.
 * Allows users to manage passwords and account security.
 */
export default function SecurityScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Shield color={Colors.primary} size={40} />
                </View>
                <Text style={styles.title}>Security & Privacy</Text>
                <Text style={styles.subtitle}>Manage your account safety and access</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.card}>
                    <SecurityOption
                        icon={<Key color={Colors.primary} size={20} />}
                        title="Change Password"
                        subtitle="Update your password regularly"
                    />
                    <View style={styles.divider} />
                    <SecurityOption
                        icon={<Lock color={Colors.primary} size={20} />}
                        title="Two-Factor Auth"
                        subtitle="Add an extra layer of security"
                        badge="New"
                    />
                    <View style={styles.divider} />
                    <SecurityOption
                        icon={<Eye color={Colors.primary} size={20} />}
                        title="Login Activity"
                        subtitle="View your recent sign-ins"
                    />
                </View>
            </View>

            <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>Security Recommendation</Text>
                <Text style={styles.warningText}>
                    Ensure your account is using a strong, unique password. We recommend updating your password every 90 days.
                </Text>
            </View>
        </ScrollView>
    );
}

interface SecurityOptionProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    badge?: string;
}

function SecurityOption({ icon, title, subtitle, badge }: SecurityOptionProps) {
    return (
        <ScalePressable style={styles.option}>
            <View style={styles.optionIcon}>{icon}</View>
            <View style={styles.optionContent}>
                <View style={styles.titleRow}>
                    <Text style={styles.optionTitle}>{title}</Text>
                    {badge && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.optionSubtitle}>{subtitle}</Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
        </ScalePressable>
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
        marginVertical: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "PTSerif_400Regular",
        color: Colors.textLight,
        marginTop: 8,
        textAlign: "center",
    },
    section: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 8,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.1)",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    optionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(179, 143, 111, 0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    optionContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    optionTitle: {
        fontSize: 16,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
    },
    optionSubtitle: {
        fontSize: 12,
        fontFamily: "PTSerif_400Regular",
        color: Colors.textLight,
        marginTop: 2,
    },
    badge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        color: Colors.secondary,
        fontSize: 10,
        fontFamily: "PTSerif_700Bold",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        marginHorizontal: 16,
    },
    warningCard: {
        backgroundColor: "rgba(179, 143, 111, 0.05)",
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    warningTitle: {
        fontSize: 14,
        fontFamily: "PTSerif_700Bold",
        color: Colors.primary,
        marginBottom: 4,
    },
    warningText: {
        fontSize: 13,
        fontFamily: "PTSerif_400Regular",
        color: Colors.textLight,
        lineHeight: 18,
    },
});
