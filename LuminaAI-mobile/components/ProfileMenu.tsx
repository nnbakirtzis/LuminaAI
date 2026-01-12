import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Pressable,
    Platform,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Colors from "../constants/Colors";
import {
    User,
    Settings,
    CreditCard,
    Shield,
    LogOut,
    X,
} from "lucide-react-native";
import ScalePressable from "./ScalePressable";

interface ProfileMenuProps {
    visible: boolean;
    onClose: () => void;
}

/**
 * Modern SaaS Profile Menu for LuminaAI.
 * Displays user info and quick actions in a sleek overlay.
 */
export default function ProfileMenu({ visible, onClose }: ProfileMenuProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const navigateTo = (path: string) => {
        onClose();
        router.push(path as any);
    };

    const handleLogout = async () => {
        onClose();
        await logout();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                <View style={styles.menuContainer}>
                    <Pressable style={styles.menuCard} onPress={(e) => {
                        e.stopPropagation();
                    }}>
                        {/* User Header */}
                        <View style={styles.header}>
                            <View style={styles.userInfo}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.name} numberOfLines={1}>
                                        {user.name}
                                    </Text>
                                    <Text style={styles.email} numberOfLines={1}>
                                        {user.email}
                                    </Text>
                                </View>
                            </View>
                            <ScalePressable onPress={() => {
                                onClose();
                            }} style={styles.closeBtn}>
                                <X color={Colors.textLight} size={20} />
                            </ScalePressable>
                        </View>

                        <View style={styles.divider} />

                        {/* Menu Options */}
                        <View style={styles.options}>
                            <MenuOption
                                icon={<User color={Colors.primary} size={18} />}
                                label="My Profile"
                                onPress={() => navigateTo("/profile")}
                            />
                            <MenuOption
                                icon={<CreditCard color={Colors.primary} size={18} />}
                                label="Subscription"
                                onPress={() => navigateTo("/pricing")}
                            />
                            <MenuOption
                                icon={<Shield color={Colors.primary} size={18} />}
                                label="Security"
                                onPress={() => navigateTo("/security")}
                            />
                            <MenuOption
                                icon={<Settings color={Colors.primary} size={18} />}
                                label="Settings"
                                onPress={() => {}} // Placeholder
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* Logout */}
                        <ScalePressable style={styles.logoutBtn} onPress={handleLogout}>
                            <LogOut color={Colors.error} size={18} />
                            <Text style={styles.logoutText}>Sign Out</Text>
                        </ScalePressable>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    );
}

interface MenuOptionProps {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
}

function MenuOption({ icon, label, onPress }: MenuOptionProps) {
    return (
        <ScalePressable style={styles.option} onPress={() => {
            onPress();
        }}>
            <View style={styles.optionIcon}>{icon}</View>
            <Text style={styles.optionLabel}>{label}</Text>
        </ScalePressable>
    );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "flex-start",
        alignItems: "flex-end",
    },
    menuContainer: {
        marginTop: Platform.OS === "ios" ? 100 : 60,
        marginRight: 20,
        width: Math.min(width * 0.85, 300),
    },
    menuCard: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(179, 143, 111, 0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(179, 143, 111, 0.15)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    avatarText: {
        fontSize: 18,
        fontFamily: "PTSerif_700Bold",
        color: Colors.primary,
    },
    name: {
        fontSize: 16,
        fontFamily: "PTSerif_700Bold",
        color: Colors.text,
    },
    email: {
        fontSize: 12,
        fontFamily: "PTSerif_400Regular",
        color: Colors.textLight,
        marginTop: 2,
    },
    closeBtn: {
        padding: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(179, 143, 111, 0.1)",
        marginVertical: 12,
    },
    options: {
        gap: 4,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    optionIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "rgba(179, 143, 111, 0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    optionLabel: {
        fontSize: 15,
        fontFamily: "PTSerif_400Regular",
        color: Colors.text,
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 12,
        gap: 12,
    },
    logoutText: {
        fontSize: 15,
        fontFamily: "PTSerif_700Bold",
        color: Colors.error,
    },
});
