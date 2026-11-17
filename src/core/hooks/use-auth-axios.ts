'use client'

import { useCallback } from "react";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAxiosWithCustomResponseInterceptor } from "@/core/hooks/use-axios";
import { useAuthStore } from "@/core/stores/use-auth-store";

export const useAuthAxios = () => {
    const token = useAuthStore((s) => s.token);
    const expiresAt = useAuthStore((s) => s.expiresAt);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const onRequest = useCallback(
        (config: InternalAxiosRequestConfig) => {
            config.headers.set("Accept", "application/json");

            if (token) {
                if (expiresAt && Date.now() >= expiresAt) {
                    clearAuth();
                } else {
                    config.headers.set("Authorization", `Bearer ${token}`);
                }
            }

            return config;
        },
        [token, expiresAt, clearAuth]
    );

    const onRejected = useCallback(
        (error: AxiosError) => {
            if (error?.response?.status === 401) {
                clearAuth();
            }
            return Promise.reject(error);
        },
        [clearAuth]
    );

    return useAxiosWithCustomResponseInterceptor({
        onRequest,
        onRejected,
    });
};
