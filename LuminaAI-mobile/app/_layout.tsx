import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import Colors from "../constants/Colors";
import { 
    useFonts, 
    PTSerif_400Regular, 
    PTSerif_700Bold, 
    PTSerif_400Regular_Italic, 
    PTSerif_700Bold_Italic 
} from "@expo-google-fonts/pt-serif";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { user, isLoading: authLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    const [fontsLoaded, fontError] = useFonts({
        PTSerif_400Regular,
        PTSerif_700Bold,
        PTSerif_400Regular_Italic,
        PTSerif_700Bold_Italic,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        if (authLoading || !fontsLoaded) return;

        const inAuthGroup = segments[0] === "(tabs)";

        if (!user && inAuthGroup) {
            router.replace("/login");
        } else if (user && !inAuthGroup && segments[0] !== "(tabs)") {
            router.replace("/(tabs)");
        }
    }, [user, segments, authLoading, fontsLoaded]);

    if (authLoading || !fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: styles.content,
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="login"
                    options={{
                        headerShown: false,
                        presentation: "modal",
                    }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.secondary,
    },
    content: {
        backgroundColor: Colors.secondary,
        width: "100%",
        alignSelf: "center",
    },
});
