'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { AxiosError } from "axios";
import useAxios from "@/core/hooks/use-axios";
import { authService } from "@/core/services/auth.service";
import { useAuthStore } from "@/core/stores/use-auth-store";
import { getSsoLoginUrl } from "@/lib/utils";
import { FiAlertCircle, FiLoader } from "react-icons/fi";

const ModuleNglAuthCallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const axios = useAxios();
    const setAuth = useAuthStore((s) => s.setAuth);

    const code = searchParams.get("code");
    const [errorMessage, setErrorMessage] = useState<string | null>(
        code ? null : "Kode SSO tidak ditemukan pada URL."
    );
    const exchangedRef = useRef(false);

    useEffect(() => {
        if (!code || exchangedRef.current) return;
        exchangedRef.current = true;

        const exchange = async () => {
            try {
                const res = await authService.ssoExchange(axios, {
                    code,
                    audience: "ngl",
                });
                setAuth(res, "ngl");
                router.replace("/inbox");
            } catch (err) {
                const axiosErr = err as AxiosError<{ message?: string }>;
                setErrorMessage(
                    axiosErr.response?.data?.message ||
                        "Kode SSO tidak valid atau sudah kedaluwarsa."
                );
            }
        };

        exchange();
    }, [code, axios, setAuth, router]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-xs space-y-4">
                {errorMessage ? (
                    <>
                        <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <h1 className="text-lg font-bold text-gray-900">
                            Autentikasi SSO Gagal
                        </h1>
                        <p className="text-sm text-gray-600">
                            {errorMessage}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2.5 pt-2 justify-center">
                            <a
                                href={getSsoLoginUrl("ngl")}
                                className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition"
                            >
                                Coba Masuk Lagi
                            </a>
                            <Link
                                href="/"
                                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200:bg-zinc-700 transition"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <FiLoader className="w-10 h-10 text-primary mx-auto animate-spin" />
                        <h1 className="text-lg font-bold text-gray-900">
                            Memverifikasi Sesi SSO...
                        </h1>
                        <p className="text-xs text-gray-500">
                            Mohon tunggu sebentar, Anda akan diarahkan ke Inbox.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ModuleNglAuthCallbackPage;
