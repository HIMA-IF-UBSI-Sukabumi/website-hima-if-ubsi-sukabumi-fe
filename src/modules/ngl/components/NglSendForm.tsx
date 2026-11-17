'use client'

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import useAxios from "@/core/hooks/use-axios";
import { nglService, type NglResolveResponse } from "@/modules/ngl/services/api/ngl.service";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiSearch,
    FiSend,
    FiUser,
    FiUsers,
    FiLock,
} from "react-icons/fi";

interface NglSendFormProps {
    initialNim?: string;
}

type SendMode = "personal" | "general";

const MAX_CONTENT_LENGTH = 2000;

const NglSendForm = ({ initialNim }: NglSendFormProps) => {
    const axios = useAxios();

    const [mode, setMode] = useState<SendMode>("personal");
    const [nim, setNim] = useState(initialNim ?? "");
    const [resolved, setResolved] = useState<NglResolveResponse | null>(null);
    const [resolveError, setResolveError] = useState<string | null>(null);

    const [content, setContent] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    const resolveMutation = useMutation({
        mutationFn: (targetNim: string) => nglService.resolveNim(axios, targetNim.trim()),
        onSuccess: (data) => {
            setResolved(data);
            setResolveError(null);
            setSubmitError(null);
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            setResolved(null);
            const status = err.response?.status;
            if (status === 404) {
                setResolveError("Mahasiswa aktif dengan NIM tersebut tidak ditemukan.");
            } else if (status === 429) {
                setResolveError("Terlalu banyak percobaan pencarian NIM. Silakan coba lagi nanti.");
            } else {
                setResolveError(
                    err.response?.data?.message || "Gagal memverifikasi NIM. Silakan coba lagi."
                );
            }
        },
    });

    const sendMutation = useMutation({
        mutationFn: () =>
            nglService.sendMessage(axios, {
                content: content.trim(),
                ...(mode === "personal" && resolved?.token ? { token: resolved.token } : {}),
            }),
        onSuccess: (res) => {
            setSubmitSuccess(res.message || "Pesan NGL berhasil dikirim.");
            setSubmitError(null);
            setContent("");
            // Single-use token is consumed after sending
            if (mode === "personal") {
                setResolved(null);
            }
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            setSubmitSuccess(null);
            const status = err.response?.status;
            if (status === 422 && mode === "personal") {
                setResolved(null);
            }
            if (status === 429) {
                setSubmitError("Terlalu banyak pesan dikirim. Tunggu sebentar sebelum mengirim lagi.");
                return;
            }
            setSubmitError(
                err.response?.data?.message || "Gagal mengirim pesan. Silakan coba lagi."
            );
        },
    });

    useEffect(() => {
        if (initialNim && initialNim.trim().length > 0) {
            resolveMutation.mutate(initialNim.trim());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialNim]);

    const handleNimChange = (value: string) => {
        setNim(value);
        if (resolved) setResolved(null);
        if (resolveError) setResolveError(null);
    };

    const handleResolveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = nim.trim();
        if (!trimmed) {
            setResolveError("Masukkan NIM mahasiswa terlebih dahulu.");
            return;
        }
        setSubmitSuccess(null);
        resolveMutation.mutate(trimmed);
    };

    const handleSendSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedContent = content.trim();
        if (!trimmedContent) {
            setSubmitError("Pesan tidak boleh kosong.");
            return;
        }
        if (trimmedContent.length > MAX_CONTENT_LENGTH) {
            setSubmitError(`Pesan maksimal ${MAX_CONTENT_LENGTH} karakter.`);
            return;
        }
        if (mode === "personal" && !resolved?.token) {
            setSubmitError("Silakan verifikasi NIM penerima terlebih dahulu.");
            return;
        }
        setSubmitSuccess(null);
        setSubmitError(null);
        sendMutation.mutate();
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Mode Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-gray-100 border border-gray-200/60">
                <button
                    type="button"
                    onClick={() => {
                        setMode("personal");
                        setSubmitError(null);
                        setSubmitSuccess(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                        mode === "personal"
                            ? "bg-white text-primary shadow-xs"
                            : "text-gray-600 hover:text-gray-900:text-zinc-200"
                    }`}
                >
                    <FiUser className="w-4 h-4 shrink-0" />
                    <span>Untuk Mahasiswa</span>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setMode("general");
                        setSubmitError(null);
                        setSubmitSuccess(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                        mode === "general"
                            ? "bg-white text-primary shadow-xs"
                            : "text-gray-600 hover:text-gray-900:text-zinc-200"
                    }`}
                >
                    <FiUsers className="w-4 h-4 shrink-0" />
                    <span>Untuk HIMA-IF</span>
                </button>
            </div>

            {/* Personal Mode: NIM Resolve */}
            {mode === "personal" && (
                <div className="space-y-3">
                    <form onSubmit={handleResolveSubmit} className="space-y-2">
                        <label
                            htmlFor="ngl-nim-input"
                            className="block text-xs font-semibold text-gray-700"
                        >
                            NIM Mahasiswa Penerima
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="ngl-nim-input"
                                type="text"
                                value={nim}
                                onChange={(e) => handleNimChange(e.target.value)}
                                placeholder="Contoh: 12240001"
                                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            <button
                                type="submit"
                                disabled={resolveMutation.isPending}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50 shrink-0"
                            >
                                <FiSearch className="w-4 h-4" />
                                <span>{resolveMutation.isPending ? "Mengecek..." : "Cek NIM"}</span>
                            </button>
                        </div>
                    </form>

                    {resolveError && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                            <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{resolveError}</span>
                        </div>
                    )}

                    {resolved && (
                        <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                            <div className="flex items-center gap-2.5 text-emerald-800">
                                <FiCheckCircle className="w-4 h-4 shrink-0" />
                                <div className="text-xs">
                                    <p className="font-bold">Penerima: {resolved.display_name}</p>
                                    <p className="text-[11px] opacity-80">
                                        Token sekali pakai aktif selama {Math.floor(resolved.expires_in / 60)} menit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Message Form */}
            <form onSubmit={handleSendSubmit} className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="ngl-content-input"
                            className="block text-xs font-semibold text-gray-700"
                        >
                            {mode === "personal"
                                ? "Pesan Anonim untuk Mahasiswa"
                                : "Pesan / Aspirasi Anonim untuk HIMA-IF"}
                        </label>
                        <span
                            className={`text-[11px] font-medium ${
                                content.length > MAX_CONTENT_LENGTH
                                    ? "text-red-500"
                                    : "text-gray-400"
                            }`}
                        >
                            {content.length}/{MAX_CONTENT_LENGTH}
                        </span>
                    </div>

                    <textarea
                        id="ngl-content-input"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={MAX_CONTENT_LENGTH}
                        placeholder={
                            mode === "personal"
                                ? "Tulis pesan rahasia atau semangat untuk temanmu..."
                                : "Tulis saran, kritik membangun, atau pesan untuk pengurus HIMA-IF..."
                        }
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
                    />
                </div>

                {submitError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                        <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                    </div>
                )}

                {submitSuccess && (
                    <div className="flex items-start gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                        <FiCheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">{submitSuccess}</p>
                            {mode === "personal" && (
                                <p className="text-[11px] opacity-80 mt-0.5">
                                    Ingin kirim lagi? Klik &ldquo;Cek NIM&rdquo; untuk membuat token baru.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                        <FiLock className="w-3.5 h-3.5" />
                        Identitas pengirim 100% dirahasiakan
                    </span>

                    <button
                        type="submit"
                        disabled={
                            sendMutation.isPending ||
                            !content.trim() ||
                            (mode === "personal" && !resolved?.token)
                        }
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:bg-gray-200:bg-zinc-800 disabled:text-gray-400:text-zinc-500 disabled:cursor-not-allowed transition cursor-pointer shadow-xs"
                    >
                        <FiSend className="w-4 h-4" />
                        <span>{sendMutation.isPending ? "Mengirim..." : "Kirim Pesan Anonim"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NglSendForm;
