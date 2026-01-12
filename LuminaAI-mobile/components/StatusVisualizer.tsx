import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Bot, Search, Brain, CheckCircle } from "lucide-react-native";
import { AgentLog } from "../types";
import Colors from "../constants/Colors";

interface StatusVisualizerProps {
    logs: AgentLog[];
    isPremium: boolean;
}

const AGENTS = [
    { id: "headhunter", name: "Headhunter", icon: Search, color: "#b38f6f" },
    { id: "economist", name: "Economist", icon: Brain, color: "#60a5fa" },
    { id: "futurist", name: "Futurist", icon: Brain, color: "#a855f7" },
    { id: "strategist", name: "Strategist", icon: Brain, color: "#f59e0b" },
];

export default function StatusVisualizer({
    logs,
    isPremium,
}: StatusVisualizerProps) {
    const activeAgents = isPremium ? AGENTS : [AGENTS[0]];

    return (
        <View style={styles.container}>
            {/* Main Status */}
            <View style={styles.header}>
                <View style={styles.botIconWrapper}>
                    <Bot color={Colors.primary} size={40} />
                </View>
                <Text style={styles.title}>Agents Deploying</Text>
                <Text style={styles.subtitle}>Analyzing the global job market with strategic precision...</Text>
            </View>

            {/* Agent Grid */}
            <View style={styles.grid}>
                {activeAgents.map((agent) => {
                    const isActive = logs.some(
                        (log) =>
                            log.agentName.toLowerCase().includes(agent.id) ||
                            log.action.toLowerCase().includes(agent.id)
                    );
                    const Icon = agent.icon;

                    return (
                        <View
                            key={agent.id}
                            style={[styles.agentCard, isActive && styles.agentCardActive]}
                        >
                            <View
                                style={[styles.agentIcon, isActive && styles.agentIconActive]}
                            >
                                <Icon color={isActive ? Colors.secondary : Colors.primary} size={20} />
                            </View>
                            <Text
                                style={[styles.agentName, isActive && styles.agentNameActive]}
                            >
                                {agent.name}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Live Logs */}
            <View style={styles.logsCard}>
                <Text style={styles.logsTitle}>Strategic Feed</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.logsScroll}>
                    {logs.slice(-5).map((log) => (
                        <View key={log.id} style={styles.logRow}>
                            <CheckCircle color={Colors.primary} size={12} style={{ marginTop: 2 }} />
                            <View style={styles.logContent}>
                                <Text style={styles.logAgent}>{log.agentName}</Text>
                                <Text style={styles.logAction}>{log.action}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingHorizontal: 24,
        width: "100%",
        maxWidth: 600,
        alignSelf: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    botIconWrapper: {
        width: 90,
        height: 90,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    title: {
        fontSize: 28,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        color: "rgba(255, 255, 255, 0.6)",
        textAlign: "center",
        lineHeight: 22,
        fontSize: 15,
        fontFamily: "PTSerif_400Regular",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
        marginBottom: 40,
    },
    agentCard: {
        width: 85,
        alignItems: "center",
        paddingVertical: 16,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.1)",
    },
    agentCardActive: {
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        borderColor: "rgba(179, 143, 111, 0.3)",
    },
    agentIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    agentIconActive: {
        backgroundColor: Colors.primary,
    },
    agentName: {
        fontSize: 11,
        fontFamily: "PTSerif_700Bold",
        textAlign: "center",
        color: Colors.textLight,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    agentNameActive: {
        color: Colors.primary,
    },
    logsCard: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 24,
        padding: 24,
        maxHeight: 220,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.15)",
    },
    logsTitle: {
        fontSize: 10,
        color: Colors.primary,
        textTransform: "uppercase",
        fontFamily: "PTSerif_700Bold",
        marginBottom: 16,
        letterSpacing: 1.5,
    },
    logsScroll: {
        maxHeight: 160,
    },
    logRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 16,
    },
    logContent: {
        flex: 1,
    },
    logAgent: {
        fontSize: 11,
        color: Colors.primary,
        fontFamily: "PTSerif_700Bold",
        textTransform: "uppercase",
        marginBottom: 2,
    },
    logAction: {
        fontSize: 13,
        color: Colors.text,
        lineHeight: 18,
        fontFamily: "PTSerif_400Regular",
    },
});
