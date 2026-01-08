import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Modal,
} from "react-native";
import {
    MapPin,
    Briefcase,
    DollarSign,
    TrendingUp,
    Brain,
    Target,
    ShieldCheck,
    Zap,
} from "lucide-react-native";
import { Job } from "../types";
import ResumeModal from "./ResumeModal";
import Colors from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import ScalePressable from "./ScalePressable";

interface JobCardProps {
    job: Job;
    onAnalyzeRealValue: () => void;
}

export default function JobCard({ job, onAnalyzeRealValue }: JobCardProps) {
    const [showRealValue, setShowRealValue] = useState(false);
    const [showResume, setShowResume] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (job.realValueAnalysis) {
            setIsAnalyzing(false);
        }
    }, [job.realValueAnalysis]);

    useEffect(() => {
        if (!showRealValue) {
            setIsAnalyzing(false);
        }
    }, [showRealValue]);

    return (
        <View style={styles.card}>
            {/* Match Score Badge */}
            <View style={styles.headerRow}>
                <View
                    style={[
                        styles.matchBadge,
                        { backgroundColor: "rgba(196, 232, 233, 0.15)" },
                    ]}
                >
                    <Target color={Colors.secondary} size={14} />
                    <Text style={[styles.matchText, { color: Colors.secondary }]}>
                        {job.matchScore || 0}% Strategic Match
                    </Text>
                </View>
                <Text style={styles.postDate}>{job.postedDate || "Recent"}</Text>
            </View>

            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company}</Text>

            {/* Meta Labels */}
            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <MapPin color={Colors.accent} size={14} />
                    <Text style={styles.metaText}>{job.location}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Briefcase color={Colors.accent} size={14} />
                    <Text style={styles.metaText}>{job.platform || "Direct"}</Text>
                </View>
                <View style={styles.metaItem}>
                    <DollarSign color={Colors.accent} size={14} />
                    <Text style={styles.metaText}>{job.salary || "Competitive"}</Text>
                </View>
            </View>

            {/* Market Intelligence Preview (if available) */}
            {job.marketIntelligence && (
                <View style={styles.intelligenceBar}>
                    <TrendingUp color={Colors.success} size={14} />
                    <Text style={styles.intelligenceText}>
                        {job.marketIntelligence.competitivenessScore}/10 Market Momentum
                    </Text>
                </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <ScalePressable
                    onPress={() => setShowRealValue(true)}
                    style={[styles.actionBtn, styles.secondaryBtn]}
                    scaleTo={0.96}
                >
                    <Brain color={Colors.primary} size={18} />
                    <Text style={styles.secondaryBtnText}>Real Value</Text>
                </ScalePressable>

                <ScalePressable
                    onPress={() => setShowResume(true)}
                    style={[styles.actionBtn, styles.primaryBtn]}
                    scaleTo={0.96}
                >
                    <Zap color={Colors.primary} size={18} />
                    <Text style={styles.primaryBtnText}>Tailor Resume</Text>
                </ScalePressable>
            </View>

            {/* Real Value Modal */}
            <Modal
                visible={showRealValue}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowRealValue(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />
                        <View style={styles.sheetHeader}>
                            <View style={styles.sheetTitleRow}>
                                <Brain color={Colors.primary} size={24} />
                                <Text style={styles.sheetTitle}>Real Value Assessment</Text>
                            </View>
                            <ScalePressable
                                onPress={() => setShowRealValue(false)}
                                style={styles.closeBtn}
                                scaleTo={0.9}
                            >
                                <Text style={styles.closeBtnText}>Done</Text>
                            </ScalePressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {!job.realValueAnalysis ? (
                                <View style={styles.loadingState}>
                                    {isAnalyzing ? (
                                        <>
                                            <ActivityIndicator color={Colors.primary} size="large" />
                                            <Text style={styles.loadingText}>
                                                Agent Economist is calculating your leverage...
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={styles.loadingText}>
                                            Run a real value analysis to compare this offer against your current location.
                                        </Text>
                                    )}
                                    {!isAnalyzing && (
                                        <ScalePressable
                                            onPress={async () => {
                                                setIsAnalyzing(true);
                                                try {
                                                    await onAnalyzeRealValue();
                                                } finally {
                                                    setIsAnalyzing(false);
                                                }
                                            }}
                                            style={styles.analyzeBtn}
                                            scaleTo={0.97}
                                        >
                                            <Text style={styles.analyzeBtnText}>Initiate Analysis</Text>
                                        </ScalePressable>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.analysisContent}>
                                    {/* Analysis Cards */}
                                    <LinearGradient
                                        colors={[Colors.primary, Colors.dark]}
                                        style={styles.valueCard}
                                    >
                                        <ShieldCheck color={Colors.secondary} size={24} />
                                        <Text style={styles.valueLabel}>Adjusted Market Value</Text>
                                        <Text style={styles.valueAmount}>
                                            {job.realValueAnalysis.adjustedValue}
                                        </Text>
                                    </LinearGradient>

                                    <View style={styles.grid}>
                                        <View style={styles.gridItem}>
                                            <TrendingUp color={Colors.success} size={20} />
                                            <Text style={styles.gridLabel}>Strategic Verdict</Text>
                                            <Text style={styles.gridValue}>
                                                {job.realValueAnalysis.verdict}
                                            </Text>
                                        </View>
                                        <View style={styles.gridItem}>
                                            <Target color={Colors.secondary} size={20} />
                                            <Text style={styles.gridLabel}>Buying Power</Text>
                                            <Text style={styles.gridValue}>
                                                {job.realValueAnalysis.purchasingPowerScore}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Macro Summary</Text>
                                        <Text style={styles.insightText}>
                                            This role offers an adjusted value of {job.realValueAnalysis.adjustedValue} when normalized for your current location's cost of living and tax implications.
                                        </Text>
                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Breakdown Analysis</Text>
                                        {job.realValueAnalysis.breakdown?.length ? (
                                            job.realValueAnalysis.breakdown.map((item, idx) => (
                                                <View key={idx} style={styles.breakdownRow}>
                                                    <Text style={styles.breakdownLabel}>{item.category}</Text>
                                                    <Text style={styles.breakdownDiff}>{item.diff}</Text>
                                                    <Text style={styles.breakdownDetails}>{item.details}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={styles.emptyBreakdown}>
                                                No detailed breakdown available.
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {showResume && (
                <ResumeModal
                    visible={showResume}
                    jobTitle={job.title}
                    company={job.company}
                    onClose={() => setShowResume(false)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    matchBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    matchText: {
        fontSize: 12,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    postDate: {
        fontSize: 12,
        color: Colors.textLight,
        fontWeight: "600",
    },
    title: {
        fontSize: 22,
        fontWeight: "900",
        color: Colors.primary,
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    company: {
        fontSize: 16,
        color: Colors.accent,
        fontWeight: "700",
        marginBottom: 20,
    },
    metaRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 20,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        color: Colors.textLight,
        fontWeight: "600",
    },
    intelligenceBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(5, 150, 105, 0.08)",
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
    },
    intelligenceText: {
        fontSize: 13,
        color: Colors.success,
        fontWeight: "700",
    },
    actions: {
        flexDirection: "row",
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
    },
    primaryBtn: {
        backgroundColor: Colors.secondary,
    },
    primaryBtnText: {
        color: Colors.primary,
        fontWeight: "800",
        fontSize: 14,
    },
    secondaryBtn: {
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    secondaryBtnText: {
        color: Colors.primary,
        fontWeight: "700",
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(33, 36, 61, 0.6)",
        justifyContent: "flex-end",
    },
    bottomSheet: {
        backgroundColor: Colors.light,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: "85%",
        padding: 24,
        paddingTop: 12,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: "#E2E8F0",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 20,
    },
    sheetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
    },
    sheetTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: Colors.primary,
    },
    closeBtn: {
        padding: 8,
    },
    closeBtnText: {
        color: Colors.accent,
        fontWeight: "700",
        fontSize: 15,
    },
    loadingState: {
        paddingVertical: 60,
        alignItems: "center",
    },
    loadingText: {
        marginTop: 20,
        textAlign: "center",
        color: Colors.textLight,
        fontWeight: "500",
        maxWidth: 240,
        lineHeight: 22,
    },
    analyzeBtn: {
        marginTop: 32,
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
    },
    analyzeBtnText: {
        color: "#fff",
        fontWeight: "800",
    },
    analysisContent: {
        paddingBottom: 40,
    },
    valueCard: {
        padding: 32,
        borderRadius: 24,
        alignItems: "center",
        marginBottom: 20,
    },
    valueLabel: {
        color: "rgba(196, 232, 233, 0.7)",
        fontSize: 14,
        fontWeight: "700",
        marginTop: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    valueAmount: {
        color: Colors.secondary,
        fontSize: 28,
        fontWeight: "900",
        marginTop: 4,
    },
    grid: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 32,
    },
    gridItem: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    gridLabel: {
        fontSize: 12,
        color: Colors.textLight,
        fontWeight: "700",
        marginTop: 12,
    },
    gridValue: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: "800",
        marginTop: 4,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: Colors.primary,
        marginBottom: 12,
    },
    insightText: {
        fontSize: 15,
        color: Colors.text,
        lineHeight: 24,
        fontWeight: "500",
    },
    breakdownRow: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    breakdownLabel: {
        fontSize: 14,
        fontWeight: "800",
        color: Colors.primary,
        marginBottom: 4,
    },
    breakdownDiff: {
        fontSize: 13,
        color: Colors.success,
        fontWeight: "700",
        marginBottom: 4,
    },
    breakdownDetails: {
        fontSize: 13,
        color: Colors.textLight,
        lineHeight: 18,
        fontWeight: "500",
    },
    emptyBreakdown: {
        fontSize: 13,
        color: Colors.textLight,
        lineHeight: 18,
        fontWeight: "500",
    },
});
