import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { Bot, Mail, Lock, User } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/Colors";

export default function LoginScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!email || !password || (!isLogin && !name)) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            router.replace("/(tabs)");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[Colors.primary, Colors.dark]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoIcon}>
                            <Bot color={Colors.secondary} size={40} />
                        </View>
                        <Text style={styles.logoText}>
                            Lumina<Text style={styles.logoAccent}>.AI</Text>
                        </Text>
                        <Text style={styles.tagline}>
                            Elevated career intelligence for the modern professional
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </Text>

                        {!isLogin && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>FULL NAME</Text>
                                <View style={styles.inputWrapper}>
                                    <User color={Colors.accent} size={20} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="John Doe"
                                        placeholderTextColor="#94a3b8"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <View style={styles.inputWrapper}>
                                <Mail color={Colors.accent} size={20} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    placeholderTextColor="#94a3b8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <View style={styles.inputWrapper}>
                                <Lock color={Colors.accent} size={20} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#94a3b8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <Pressable
                            onPress={handleSubmit}
                            disabled={isLoading}
                            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={Colors.primary} />
                            ) : (
                                <Text style={styles.submitBtnText}>
                                    {isLogin ? "Sign In" : "Create Account"}
                                </Text>
                            )}
                        </Pressable>

                        <Pressable onPress={() => setIsLogin(!isLogin)} style={styles.toggleBtn}>
                            <Text style={styles.toggleText}>
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <Text style={styles.toggleAccent}>
                                    {isLogin ? "Sign Up" : "Sign In"}
                                </Text>
                            </Text>
                        </Pressable>
                    </View>

                    {/* Footer */}
                    <Text style={styles.footer}>
                        Empowering your career with elegant AI
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 48,
        // Responsive fix
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoIcon: {
        width: 80,
        height: 80,
        backgroundColor: "rgba(196, 232, 233, 0.08)",
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(196, 232, 233, 0.15)",
    },
    logoText: {
        fontSize: 36,
        fontWeight: "900",
        color: Colors.textOnDark,
        letterSpacing: -1,
    },
    logoAccent: {
        color: Colors.secondary,
    },
    tagline: {
        color: "rgba(196, 232, 233, 0.7)",
        marginTop: 8,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "500",
        maxWidth: 280,
        lineHeight: 22,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderRadius: 32,
        padding: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 40,
        elevation: 20,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: Colors.primary,
        marginBottom: 32,
        textAlign: "center",
        letterSpacing: -0.5,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 10,
        fontWeight: "800",
        color: Colors.accent,
        letterSpacing: 2,
        marginBottom: 10,
        textTransform: "uppercase",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F5F9",
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 16,
    },
    input: {
        flex: 1,
        marginLeft: 14,
        fontSize: 16,
        color: Colors.primary,
        fontWeight: "600",
        // Fix for web outline
        ...Platform.select({
            web: { outlineStyle: "none" } as any,
        }),
    },
    submitBtn: {
        backgroundColor: Colors.secondary,
        paddingVertical: 20,
        borderRadius: 18,
        alignItems: "center",
        marginTop: 12,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    submitBtnDisabled: {
        backgroundColor: Colors.accent,
        opacity: 0.5,
    },
    submitBtnText: {
        color: Colors.primary,
        fontWeight: "900",
        fontSize: 17,
        letterSpacing: 1,
    },
    toggleBtn: {
        marginTop: 24,
        paddingVertical: 8,
    },
    toggleText: {
        textAlign: "center",
        color: Colors.textLight,
        fontSize: 14,
        fontWeight: "500",
    },
    toggleAccent: {
        color: Colors.primary,
        fontWeight: "800",
    },
    footer: {
        textAlign: "center",
        color: "rgba(196, 232, 233, 0.4)",
        fontSize: 12,
        marginTop: 40,
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
    },
});
