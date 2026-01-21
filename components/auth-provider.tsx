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

            // Check if avatar is missing in preferences
            if (currentUser && (!currentUser.prefs?.avatar && !currentUser.prefs?.image)) {
                try {
                    const session = await account.getSession('current');
                    let avatarUrl = '';

                    if (session.provider === 'google') {
                        try {
                            const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${session.providerAccessToken}`);
                            const data = await res.json();
                            if (data.picture) {
                                avatarUrl = data.picture;
                            }
                        } catch (e) {
                            console.error("Error fetching Google avatar:", e);
                        }
                    } else if (session.provider === 'facebook') {
                        try {
                            const res = await fetch(`https://graph.facebook.com/me/picture?type=large&redirect=false&access_token=${session.providerAccessToken}`);
                            const data = await res.json();
                            if (data.data?.url) {
                                avatarUrl = data.data.url;
                            }
                        } catch (e) {
                            console.error("Error fetching Facebook avatar:", e);
                        }
                    }

                    if (avatarUrl) {
                        try {
                            const updatedUser = await account.updatePrefs({
                                ...currentUser.prefs,
                                avatar: avatarUrl
                            });
                            setUser(updatedUser);
                            setIsLoading(false);
                            return;
                        } catch (e) {
                            console.error("Error updating prefs with avatar:", e);
                        }
                    }
                } catch (e) {
                    console.error("Error getting session or fetching avatar:", e);
                }
            }

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
