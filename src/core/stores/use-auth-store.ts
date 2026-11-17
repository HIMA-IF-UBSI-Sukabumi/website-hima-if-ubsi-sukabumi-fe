'use client'

import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, AuthUser, SsoAudience } from "@/core/services/auth.service";

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    expiresAt: number | null;
    audience: SsoAudience | null;
    hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    setAuth: (data: AuthResponse, audience: SsoAudience) => void;
    setUser: (user: AuthUser) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
    hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            expiresAt: null,
            audience: null,
            hasHydrated: false,
            setHasHydrated: (hasHydrated) => set({ hasHydrated }),
            setAuth: (data, audience) =>
                set({
                    token: data.token,
                    user: data.user,
                    expiresAt: Date.now() + data.expires_in * 1000,
                    audience,
                }),
            setUser: (user) => set({ user }),
            clearAuth: () =>
                set({
                    token: null,
                    user: null,
                    expiresAt: null,
                    audience: null,
                }),
            isAuthenticated: () => {
                const { token, expiresAt } = get();
                if (!token) return false;
                if (expiresAt && Date.now() >= expiresAt) {
                    return false;
                }
                return true;
            },
            hasRole: (role) => {
                const { user } = get();
                return Boolean(user?.roles?.includes(role));
            },
        }),
        {
            name: "himaif-auth",
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                expiresAt: state.expiresAt,
                audience: state.audience,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

export const useIsAuthenticated = () => {
    const token = useAuthStore((s) => s.token);
    const expiresAt = useAuthStore((s) => s.expiresAt);
    const hasHydrated = useAuthStore((s) => s.hasHydrated);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    useEffect(() => {
        if (hasHydrated && token && expiresAt && Date.now() >= expiresAt) {
            clearAuth();
        }
    }, [hasHydrated, token, expiresAt, clearAuth]);

    return {
        isLoggedIn: hasHydrated && Boolean(token),
        hasHydrated,
    };
};
