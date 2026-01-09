import { supabase } from "./supabase";
import { User } from "../types";
import { log, error as logError } from "../utils/logger";

// ----------------------------------------------------------------------
// AUTH SERVICE (Integrated with Supabase)
// ----------------------------------------------------------------------

export const loginUser = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        logError("auth:login:error", { email, message: error.message });
        throw error;
    }

    const authUser = data.user;
    if (!authUser) throw new Error("No user data returned");

    log("auth:login:success", { email });

    return {
        id: authUser.id,
        email: authUser.email || email,
        name: authUser.user_metadata?.name || email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.user_metadata?.name || email)}&background=0D9488&color=fff`
    };
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name,
            },
        },
    });

    if (error) {
        logError("auth:register:error", { email, message: error.message });
        throw error;
    }

    const authUser = data.user;
    if (!authUser) throw new Error("Registration failed");

    log("auth:register:success", { email });

    return {
        id: authUser.id,
        email: authUser.email || email,
        name: name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`
    };
};

export const logoutUser = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        logError("auth:logout:error", { message: error.message });
        throw error;
    }
    log("auth:logout:success");
};

export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        return null;
    }

    const authUser = session.user;
    return {
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "User",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.user_metadata?.name || authUser.email || "U")}&background=0D9488&color=fff`
    };
};
