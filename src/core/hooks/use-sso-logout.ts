'use client'

import { useState } from "react";
import { useAuthAxios } from "@/core/hooks/use-auth-axios";
import { authService, type SsoAudience } from "@/core/services/auth.service";
import { useAuthStore } from "@/core/stores/use-auth-store";
import { getSsoLogoutUrl } from "@/lib/utils";

/**
 * Revokes the local Sanctum bearer token, clears client auth state,
 * and redirects to the Console SSO single-logout endpoint.
 */
export const useSsoLogout = (defaultAudience: SsoAudience) => {
    const authAxios = useAuthAxios();
    const audience = useAuthStore((s) => s.audience);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const [loggingOut, setLoggingOut] = useState(false);

    const logout = async () => {
        setLoggingOut(true);
        try {
            await authService.logout(authAxios);
        } catch {
            // Clear local auth even if the token is already expired or revoked
        } finally {
            const targetAudience = audience ?? defaultAudience;
            clearAuth();
            if (typeof window !== "undefined") {
                window.location.href = getSsoLogoutUrl(
                    targetAudience,
                    window.location.origin
                );
            } else {
                setLoggingOut(false);
            }
        }
    };

    return { logout, loggingOut };
};
