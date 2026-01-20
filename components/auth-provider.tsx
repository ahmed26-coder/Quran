"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { Models, OAuthProvider } from "appwrite";

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    isLoading: boolean;
    logout: () => Promise<void>;
    loginWithGoogle: () => void;
    loginWithFacebook: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const logout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const loginWithGoogle = () => {
        account.createOAuth2Session(
            OAuthProvider.Google,
            'https://quranee.netlify.app', // ✅ successUrl (الصفحة الرئيسية)
            'https://quranee.netlify.app/auth/login' // ✅ failureUrl
        );
    };

    const loginWithFacebook = () => {
        account.createOAuth2Session(
            OAuthProvider.Facebook,
            'https://quranee.netlify.app', // ✅ successUrl
            'https://quranee.netlify.app/auth/login'  // ✅ failureUrl
        );
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logout, loginWithGoogle, loginWithFacebook, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
