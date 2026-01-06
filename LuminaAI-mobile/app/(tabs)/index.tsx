import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Platform,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PreferenceForm from "../../components/PreferenceForm";
import JobCard from "../../components/JobCard";
import StatusVisualizer from "../../components/StatusVisualizer";
import { findAndRankJobs, calculateRealValue } from "../../services/gemini";
import { Job, UserPreferences, AgentLog } from "../../types";
import { Sparkles, Briefcase } from "lucide-react-native";
import Colors from "../../constants/Colors";
import { log, error as logError } from "../../utils/logger";

export default function HomeScreen() {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPrefs, setCurrentPrefs] = useState<UserPreferences | null>(null);

    const handleSearch = async (prefs: UserPreferences) => {
        setLoading(true);
        setHasSearched(true);
        setJobs([]);
        setLogs([]);
        setCurrentPrefs(prefs);

        try {
            log("search:start", {
                jobTitle: prefs.jobTitle,
                location: prefs.location,
                enableIntelligence: prefs.enableIntelligence,
            });
            const results = await findAndRankJobs(prefs, (agent: string, action: string) => {
                setLogs((prev) => [
                    ...prev,
                    {
                        id: Math.random().toString(),
                        agentName: agent,
                        action: action,
                        timestamp: new Date(),
                    },
                ]);
            });
            setJobs(results);
            log("search:complete", { count: results.length });
        } catch (error) {
            logError("search:error", { message: (error as Error)?.message });
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRealValue = async (job: Job) => {
        try {
            if (!currentPrefs?.location) {
                Alert.alert("Missing Location", "Please run a search with a location first.");
                logError("real_value:missing_location", { jobId: job.id });
                return;
            }
            log("real_value:start", { jobId: job.id, title: job.title });
            const analysis = await calculateRealValue(job, currentPrefs.location, (agent, action) => {
                console.log(`[${agent}] ${action}`);
            });
            setJobs((prev) =>
                prev.map((j) => (j.id === job.id ? { ...j, realValueAnalysis: analysis } : j))
            );
            log("real_value:complete", { jobId: job.id });
        } catch (error) {
            logError("real_value:error", { jobId: job.id, message: (error as Error)?.message });
            console.error("Real value analysis failed:", error);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <LinearGradient
                    colors={[Colors.primary, Colors.dark]}
                    style={styles.loadingWrapper}
                >
                    <StatusVisualizer logs={logs} isPremium={currentPrefs?.enableIntelligence || false} />
                </LinearGradient>
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        <View style={styles.headerSection}>
                            {!hasSearched && (
                                <View style={styles.heroSection}>
                                    <LinearGradient
                                        colors={["rgba(196, 232, 233, 0.15)", "rgba(196, 232, 233, 0.05)"]}
                                        style={styles.heroIconWrapper}
                                    >
                                        <Sparkles color={Colors.secondary} size={32} />
                                    </LinearGradient>
                                    <Text style={styles.heroTitle}>
                                        Future-Proof Your <Text style={styles.heroAccent}>Career</Text>
                                    </Text>
                                    <Text style={styles.heroSubtitle}>
                                        Deploy specialized AI agents to discover, analyze, and secure your next role with mathematical precision.
                                    </Text>
                                </View>
                            )}

                            <View style={styles.formContainer}>
                                <PreferenceForm onSubmit={handleSearch} isLoading={loading} />
                            </View>

                            {jobs.length > 0 && (
                                <View style={styles.resultsHeader}>
                                    <Briefcase color={Colors.primary} size={20} />
                                    <Text style={styles.resultsTitle}>
                                        Strategic Matches ({jobs.length})
                                    </Text>
                                </View>
                            )}
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                                <JobCard
                                    job={item}
                                    onAnalyzeRealValue={() => handleRealValue(item)}
                                />
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        hasSearched && !loading ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No matches found. Try refining your strategy.</Text>
                            </View>
                        ) : null
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    loadingWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        paddingBottom: 40,
        maxWidth: 800,
        width: "100%",
        alignSelf: "center",
    },
    headerSection: {
        paddingTop: 32,
        paddingHorizontal: 20,
    },
    heroSection: {
        alignItems: "center",
        marginBottom: 32,
        backgroundColor: Colors.primary,
        borderRadius: 32,
        padding: 32,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 8,
    },
    heroIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(196, 232, 233, 0.3)",
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: "900",
        color: Colors.textOnDark,
        textAlign: "center",
        letterSpacing: -1,
    },
    heroAccent: {
        color: Colors.secondary,
    },
    heroSubtitle: {
        color: "rgba(196, 232, 233, 0.8)",
        textAlign: "center",
        marginTop: 12,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500",
        maxWidth: 300,
    },
    formContainer: {
        marginTop: -40, // Pull form up into hero card overlapping
        paddingHorizontal: 0,
        marginBottom: 32,
    },
    resultsHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
        paddingHorizontal: 4,
        // Web fix
        maxWidth: 800,
        width: "100%",
        alignSelf: "center",
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: Colors.primary,
        letterSpacing: -0.5,
    },
    cardWrapper: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    emptyState: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        color: Colors.textLight,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "500",
    },
});
