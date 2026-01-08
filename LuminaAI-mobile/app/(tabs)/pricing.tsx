import React from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Zap, Crown, ShieldCheck } from "lucide-react-native";
import Colors from "../../constants/Colors";
import ScalePressable from "../../components/ScalePressable";

const PLANS = [
    {
        name: "Standard",
        price: "Free",
        desc: "Essential career search capabilities.",
        icon: Zap,
        features: ["Basic Job Matching", "5 Agent Scans / Day", "Resume Mirroring"],
        cta: "Curated Access",
        popular: false,
    },
    {
        name: "Strategic",
        price: "$19",
        desc: "Complete market intelligence network.",
        icon: Crown,
        features: [
            "Unlimited Agent Scans",
            "Market Intelligence Agents",
            "Real Value Analysis",
            "Priority Resume Tailoring",
        ],
        cta: "Upgrade to Strategic",
        popular: true,
    },
];

export default function PricingScreen() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient colors={[Colors.primary, Colors.dark]} style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Select Your Strategy</Text>
                    <Text style={styles.headerSubtitle}>
                        Unlock specialized agents and advanced market intelligence.
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                {PLANS.map((plan, idx) => {
                    const Icon = plan.icon;
                    return (
                        <View
                            key={plan.name}
                            style={[
                                styles.planCard,
                                plan.popular && styles.popularCard,
                            ]}
                        >
                            {plan.popular && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>ELITE CHOICE</Text>
                                </View>
                            )}

                            <View style={styles.planHeader}>
                                <View
                                    style={[
                                        styles.iconWrapper,
                                        { backgroundColor: plan.popular ? "rgba(196, 232, 233, 0.1)" : "#F1F5F9" },
                                    ]}
                                >
                                    <Icon color={plan.popular ? Colors.secondary : Colors.primary} size={28} />
                                </View>
                                <View>
                                    <Text style={[styles.planName, plan.popular && styles.textWhite]}>
                                        {plan.name}
                                    </Text>
                                    <Text style={[styles.planPrice, plan.popular && styles.textSecondary]}>
                                        {plan.price}
                                        <Text style={[styles.pricePeriod, plan.popular && styles.textMuted]}>
                                            /month
                                        </Text>
                                    </Text>
                                </View>
                            </View>

                            <Text style={[styles.planDesc, plan.popular && styles.textMuted]}>
                                {plan.desc}
                            </Text>

                            <View style={styles.featureList}>
                                {plan.features.map((feature) => (
                                    <View key={feature} style={styles.featureItem}>
                                        <ShieldCheck color={plan.popular ? Colors.secondary : Colors.success} size={18} />
                                        <Text style={[styles.featureText, plan.popular && styles.textWhite]}>
                                            {feature}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <ScalePressable
                                style={[
                                    styles.cta,
                                    plan.popular ? styles.popularCta : styles.standardCta,
                                ]}
                                scaleTo={0.97}
                            >
                                <Text
                                    style={[
                                        styles.ctaText,
                                        plan.popular ? styles.popularCtaText : styles.standardCtaText,
                                    ]}
                                >
                                    {plan.cta}
                                </Text>
                            </ScalePressable>
                        </View>
                    );
                })}

                <Text style={styles.disclaimer}>
                    Security & Privacy are built into our strategic framework.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    header: {
        paddingTop: 40,
        paddingBottom: 70,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerContent: {
        maxWidth: 800,
        width: "100%",
        alignSelf: "center",
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "900",
        color: Colors.textOnDark,
        letterSpacing: -1,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "rgba(196, 232, 233, 0.8)",
        marginTop: 8,
        fontWeight: "500",
        maxWidth: 280,
        lineHeight: 22,
    },
    content: {
        padding: 20,
        marginTop: -40,
        maxWidth: 800,
        width: "100%",
        alignSelf: "center",
    },
    planCard: {
        backgroundColor: Colors.light,
        borderRadius: 32,
        padding: 32,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        borderWidth: 1,
        borderColor: "#F1F5F9",
        position: "relative",
    },
    popularCard: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOpacity: 0.2,
    },
    badge: {
        position: "absolute",
        top: -12,
        right: 32,
        backgroundColor: Colors.secondary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 1,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "900",
        color: Colors.primary,
    },
    planHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
    },
    iconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    planName: {
        fontSize: 18,
        fontWeight: "800",
        color: Colors.primary,
    },
    planPrice: {
        fontSize: 28,
        fontWeight: "900",
        color: Colors.primary,
        marginTop: 2,
    },
    pricePeriod: {
        fontSize: 14,
        color: Colors.textLight,
        fontWeight: "600",
    },
    planDesc: {
        fontSize: 14,
        color: Colors.textLight,
        lineHeight: 20,
        marginBottom: 24,
        fontWeight: "500",
    },
    featureList: {
        gap: 16,
        marginBottom: 32,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    featureText: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: "600",
    },
    cta: {
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: "center",
    },
    standardCta: {
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    popularCta: {
        backgroundColor: Colors.secondary,
    },
    ctaText: {
        fontSize: 16,
        fontWeight: "800",
    },
    standardCtaText: {
        color: Colors.primary,
    },
    popularCtaText: {
        color: Colors.primary,
    },
    textWhite: {
        color: Colors.textOnDark,
    },
    textSecondary: {
        color: Colors.secondary,
    },
    textMuted: {
        color: "rgba(196, 232, 233, 0.7)",
    },
    disclaimer: {
        textAlign: "center",
        color: Colors.textLight,
        fontSize: 12,
        marginTop: 20,
        fontWeight: "500",
    },
});
