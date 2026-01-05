import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Home, DollarSign, Info, HelpCircle, User } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import Colors from "../../constants/Colors";

export default function TabLayout() {
    const { user, logout } = useAuth();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: styles.header,
                headerTintColor: Colors.textOnDark,
                headerTitleStyle: styles.headerTitle,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: Colors.secondary,
                tabBarInactiveTintColor: Colors.accent,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarItemStyle: styles.tabBarItem,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Search",
                    headerTitle: () => (
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>
                                Lumina<Text style={styles.logoAccent}>.AI</Text>
                            </Text>
                        </View>
                    ),
                    headerRight: () =>
                        user ? (
                            <View style={styles.userBadge}>
                                <User color={Colors.secondary} size={16} />
                                <Text style={styles.userName}>{user.name.split(" ")[0]}</Text>
                            </View>
                        ) : null,
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                            <Home color={color} size={22} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="pricing"
                options={{
                    title: "Pricing",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                            <DollarSign color={color} size={22} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: "Mission",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                            <Info color={color} size={22} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="faq"
                options={{
                    title: "FAQ",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                            <HelpCircle color={color} size={22} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.primary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderBottomWidth: 0,
    },
    headerTitle: {
        fontWeight: "800",
        fontSize: 18,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoText: {
        color: Colors.textOnDark,
        fontSize: 22,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    logoAccent: {
        color: Colors.secondary,
    },
    userBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(196, 232, 233, 0.12)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 16,
        gap: 6,
        borderWidth: 1,
        borderColor: "rgba(196, 232, 233, 0.2)",
    },
    userName: {
        color: Colors.secondary,
        fontWeight: "700",
        fontSize: 13,
    },
    tabBar: {
        backgroundColor: Colors.primary,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.05)",
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        height: Platform.OS === 'ios' ? 88 : 68,
        width: "100%",
        alignSelf: "center",
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: "700",
        marginTop: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    tabBarItem: {
        paddingTop: 4,
    },
    iconWrapper: {
        width: 42,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    iconWrapperActive: {
        backgroundColor: "rgba(196, 232, 233, 0.15)",
    },
});
