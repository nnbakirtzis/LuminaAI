import * as SecureStore from 'expo-secure-store';
import { User } from "../types";
import { log, error as logError } from "../utils/logger";

// ----------------------------------------------------------------------
// AUTH SERVICE (Migrated to use expo-secure-store)
// When ready for production, replace with Firebase or your auth provider.
// ----------------------------------------------------------------------

const DELAY_MS = 800;
const STORAGE_KEY = 'lumina_user';

export const loginUser = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            if (password.length < 6) {
                log("auth:login:invalid_password", { email });
                reject(new Error("Password must be at least 6 characters"));
                return;
            }

            const mockUser: User = {
                id: "user_" + Math.random().toString(36).substr(2, 9),
                email: email,
                name: email.split('@')[0],
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=0D9488&color=fff`
            };

            try {
                await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(mockUser));
                log("auth:login:success", { email });
                resolve(mockUser);
            } catch (error) {
                logError("auth:login:storage_error", { email });
                reject(new Error("Failed to save user session"));
            }
        }, DELAY_MS);
    });
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            if (!email.includes('@')) {
                log("auth:register:invalid_email", { email });
                reject(new Error("Invalid email address"));
                return;
            }

            const newUser: User = {
                id: "user_" + Math.random().toString(36).substr(2, 9),
                email,
                name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`
            };

            try {
                await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(newUser));
                log("auth:register:success", { email });
                resolve(newUser);
            } catch (error) {
                logError("auth:register:storage_error", { email });
                reject(new Error("Failed to save user session"));
            }
        }, DELAY_MS);
    });
};

export const logoutUser = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                await SecureStore.deleteItemAsync(STORAGE_KEY);
                log("auth:logout:success");
                resolve();
            } catch (error) {
                logError("auth:logout:storage_error");
                reject(new Error("Failed to clear session"));
            }
        }, 400);
    });
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const stored = await SecureStore.getItemAsync(STORAGE_KEY);
        log("auth:current_user", { found: Boolean(stored) });
        if (stored) return JSON.parse(stored);
        return null;
    } catch (error) {
        logError("auth:current_user:read_error");
        console.error("Failed to get current user", error);
        return null;
    }
};
