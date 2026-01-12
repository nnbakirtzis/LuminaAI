import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform, Pressable } from "react-native";
import { Home, DollarSign, Info, HelpCircle, User, UserCircle } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import Colors from "../../constants/Colors";
import { useState } from "react";
import ProfileMenu from "../../components/ProfileMenu";
import ScalePressable from "../../components/ScalePressable";

export default function TabLayout() {
    const { user, logout } = useAuth();
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: true,
                    headerStyle: styles.header,
                    headerTintColor: Colors.primary,
                    headerTitleStyle: styles.headerTitle,
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: Colors.primary,
                    tabBarInactiveTintColor: Colors.textLight,
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
                                <ScalePressable 
                                    onPress={() => setMenuVisible(true)}
                                    style={styles.userBadge}
                                >
                                    <User color={Colors.primary} size={16} />
                                    <Text style={styles.userName}>{user.name.split(" ")[0]}</Text>
                                </ScalePressable>
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
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        href: null, // Hide from tab bar
                        headerTitle: "Account Settings",
                    }}
                />
                <Tabs.Screen
                    name="security"
                    options={{
                        title: "Security",
                        href: null, // Hide from tab bar
                        headerTitle: "Security Settings",
                    }}
                />
            </Tabs>

            <ProfileMenu 
                visible={menuVisible} 
                onClose={() => setMenuVisible(false)} 
            />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.secondary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(179, 143, 111, 0.1)",
    },
    headerTitle: {
        fontFamily: "PTSerif_700Bold",
        fontSize: 18,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoText: {
        color: Colors.text,
        fontSize: 22,
        fontFamily: "PTSerif_700Bold",
        letterSpacing: -0.5,
    },
    logoAccent: {
        color: Colors.primary,
    },
    userBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 16,
        gap: 6,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
    },
    userName: {
        color: Colors.primary,
        fontFamily: "PTSerif_700Bold",
        fontSize: 13,
    },
    tabBar: {
        backgroundColor: Colors.secondary,
        borderTopWidth: 1,
        borderTopColor: "rgba(179, 143, 111, 0.1)",
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        height: Platform.OS === 'ios' ? 88 : 68,
        width: "100%",
        alignSelf: "center",
    },
    tabBarLabel: {
        fontSize: 10,
        fontFamily: "PTSerif_700Bold",
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
        backgroundColor: "rgba(179, 143, 111, 0.15)",
    },
});
