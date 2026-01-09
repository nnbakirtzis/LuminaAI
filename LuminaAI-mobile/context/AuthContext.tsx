import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { loginUser, logoutUser, registerUser } from '../services/auth';
import { supabase } from '../services/supabase';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (name: string, email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Initial Session Check
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                handleSupabaseUser(session.user);
            }
            setIsLoading(false);
        };

        checkSession();

        // 2. Listen for Auth Changes (Login, Logout, Session Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                handleSupabaseUser(session.user);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSupabaseUser = (authUser: any) => {
        setUser({
            id: authUser.id,
            email: authUser.email || "",
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "User",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.user_metadata?.name || authUser.email || "U")}&background=0D9488&color=fff`
        });
    };

    const login = async (email: string, pass: string) => {
        const user = await loginUser(email, pass);
        // setUser is handled by onAuthStateChange listener
    };

    const register = async (name: string, email: string, pass: string) => {
        const user = await registerUser(name, email, pass);
        // setUser is handled by onAuthStateChange listener
    };

    const logout = async () => {
        await logoutUser();
        // setUser(null) is handled by onAuthStateChange listener
    };

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...userData } : null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
