import React from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Target, Users, Shield, ArrowRight } from "lucide-react-native";
import Colors from "../../constants/Colors";

export default function AboutScreen() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Hero Header */}
            <LinearGradient colors={[Colors.secondary, "#2A2A2A"]} style={styles.hero}>
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>Our Mission</Text>
                    <Text style={styles.heroSubtitle}>
                        To democratize high-level career intelligence through strategic AI
                        delegation.
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                {/* Value Cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>WHY LUMINA</Text>
                    <Text style={styles.sectionTitle}>Precision in every match</Text>

                    <View style={styles.grid}>
                        <View style={styles.valueCard}>
                            <View
                                style={[
                                    styles.iconBox,
                                    { backgroundColor: "rgba(196, 232, 233, 0.1)" },
                                ]}
                            >
                                <Target color={Colors.primary} size={24} />
                            </View>
                            <Text style={styles.valueTitle}>Mathematical Range</Text>
                            <Text style={styles.valueDesc}>
                                We calculate real market value, not just listed salary ranges.
                            </Text>
                        </View>

                        <View style={styles.valueCard}>
                            <View
                                style={[
                                    styles.iconBox,
                                    { backgroundColor: "rgba(196, 232, 233, 0.1)" },
                                ]}
                            >
                                <Users color={Colors.primary} size={24} />
                            </View>
                            <Text style={styles.valueTitle}>Agent Network</Text>
                            <Text style={styles.valueDesc}>
                                Specialized AI agents working in concert to find your ideal
                                role.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Story Section */}
                <View style={styles.storyCard}>
                    <Shield color={Colors.primary} size={32} />
                    <Text style={styles.storyTitle}>Our Heritage</Text>
                    <Text style={styles.storyText}>
                        Lumina.AI was founded on the principle that job seekers deserve the
                        same level of intelligence as recruiters. We've built an ecosystem
                        of agents that think like economists, futurists, and career
                        strategists to give you an unfair advantage in the market.
                    </Text>
                </View>

                {/* CTA */}
                <Pressable style={styles.cta}>
                    <Text style={styles.ctaText}>Explore Our Technology</Text>
                    <ArrowRight color={Colors.primary} size={18} />
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
    },
    hero: {
        paddingTop: 60,
        paddingBottom: 80,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    heroContent: {
        maxWidth: 800,
        width: "100%",
        alignSelf: "center",
    },
    heroTitle: {
        fontSize: 40,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
        letterSpacing: -1,
    },
    heroSubtitle: {
        fontSize: 18,
        color: "rgba(255, 255, 255, 0.6)",
        marginTop: 16,
        lineHeight: 28,
        maxWidth: 320,
        fontFamily: "PTSerif_400Regular",
    },
    content: {
        padding: 24,
        marginTop: -40,
        // Web Layout fix
        maxWidth: 800,
        width: "100%",
        alignSelf: "center",
    },
    section: {
        marginBottom: 40,
    },
    sectionLabel: {
        fontSize: 10,
        fontFamily: "PTSerif_700Bold",
        color: Colors.primary,
        letterSpacing: 2,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
        marginBottom: 24,
        letterSpacing: -0.5,
    },
    grid: {
        flexDirection: "row",
        gap: 16,
    },
    valueCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        padding: 24,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.1)",
    },
    iconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
    },
    valueTitle: {
        fontSize: 16,
        fontFamily: "PTSerif_700Bold",
        color: Colors.primary,
        marginBottom: 8,
    },
    valueDesc: {
        fontSize: 13,
        color: Colors.textLight,
        lineHeight: 20,
        fontFamily: "PTSerif_400Regular",
    },
    storyCard: {
        backgroundColor: Colors.surface,
        padding: 40,
        borderRadius: 32,
        marginBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    storyTitle: {
        fontSize: 24,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
        marginTop: 20,
        marginBottom: 16,
    },
    storyText: {
        fontSize: 15,
        color: "rgba(255, 255, 255, 0.6)",
        lineHeight: 26,
        fontFamily: "PTSerif_400Regular",
    },
    cta: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.primary,
        paddingVertical: 20,
        borderRadius: 20,
        gap: 12,
    },
    ctaText: {
        fontSize: 16,
        fontFamily: "PTSerif_700Bold",
        color: Colors.secondary,
    },
});
