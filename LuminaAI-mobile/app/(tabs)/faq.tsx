import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react-native";
import Colors from "../../constants/Colors";
import ScalePressable from "../../components/ScalePressable";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
    {
        question: "How do the agents actually find jobs?",
        answer:
            "Our agents use a combination of direct API access to major job boards and sophisticated web intelligence to identify roles that match your specific strategic parameters.",
    },
    {
        question: "What is 'Market Intelligence'?",
        answer:
            "This is a premium feature where Economist and Futurist agents analyze salary trends, company stability, and industry growth to calculate your real leverage in negotiations.",
    },
    {
        question: "Is my resume data secure?",
        answer:
            "Completely. We use encrypted storage and our AI processing is transient, meaning your sensitive professional data is never used to train global models.",
    },
    {
        question: "What does 'Real Value' mean?",
        answer:
            "The listed salary is rarely the full story. Real Value considers local cost of living, stock options risk, and projected career growth for that specific role.",
    },
];

export default function FAQScreen() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const toggleExpand = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient colors={[Colors.secondary, "#2A2A2A"]} style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Intelligence Support</Text>
                    <Text style={styles.headerSubtitle}>
                        Understanding the framework of Lumina's strategic agent network.
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                {FAQS.map((faq, index) => {
                    const isExpanded = expandedIndex === index;
                    return (
                        <ScalePressable
                            key={index}
                            onPress={() => toggleExpand(index)}
                            style={[styles.faqCard, isExpanded && styles.faqCardActive]}
                            scaleTo={0.98}
                        >
                            <View style={styles.questionHeader}>
                                <Text style={[styles.question, isExpanded && styles.questionActive]}>
                                    {faq.question}
                                </Text>
                                <View
                                    style={[
                                        styles.iconBox,
                                        isExpanded && { backgroundColor: "rgba(196, 232, 233, 0.2)" },
                                    ]}
                                >
                                    <ChevronDown
                                        color={isExpanded ? Colors.secondary : Colors.accent}
                                        size={20}
                                        style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}
                                    />
                                </View>
                            </View>
                            {isExpanded && (
                                <View style={styles.answerContainer}>
                                    <Text style={styles.answer}>{faq.answer}</Text>
                                </View>
                            )}
                        </ScalePressable>
                    );
                })}

                <View style={styles.contactSection}>
                    <View style={styles.contactIcon}>
                        <MessageCircle color={Colors.primary} size={32} />
                    </View>
                    <Text style={styles.contactTitle}>Still have questions?</Text>
                    <Text style={styles.contactText}>
                        Our human strategists are available for complex inquiries.
                    </Text>
                    <ScalePressable style={styles.contactBtn} scaleTo={0.96}>
                        <Text style={styles.contactBtnText}>Contact Strategy Team</Text>
                    </ScalePressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
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
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
        letterSpacing: -1,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.6)",
        marginTop: 8,
        fontFamily: "PTSerif_400Regular",
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
    faqCard: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.1)",
    },
    faqCardActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.surface,
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 6,
    },
    questionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    question: {
        fontSize: 16,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
        flex: 1,
        lineHeight: 22,
    },
    questionActive: {
        color: Colors.primary,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 16,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
    },
    answerContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(179, 143, 111, 0.1)",
    },
    answer: {
        fontSize: 15,
        color: Colors.textLight,
        lineHeight: 24,
        fontFamily: "PTSerif_400Regular",
    },
    contactSection: {
        marginTop: 40,
        backgroundColor: Colors.surface,
        borderRadius: 32,
        padding: 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    contactIcon: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
    },
    contactTitle: {
        fontSize: 22,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
        marginBottom: 8,
    },
    contactText: {
        fontSize: 15,
        color: "rgba(255, 255, 255, 0.6)",
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 22,
        fontFamily: "PTSerif_400Regular",
    },
    contactBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    contactBtnText: {
        fontSize: 15,
        fontFamily: "PTSerif_700Bold",
        color: Colors.secondary,
    },
});
