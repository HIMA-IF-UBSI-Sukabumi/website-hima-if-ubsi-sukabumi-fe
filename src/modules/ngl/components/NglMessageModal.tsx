'use client'

import { useEffect, useState } from "react";
import { formatTimestamp, getNglUrl } from "@/lib/utils";
import { useLockBodyScroll } from "@/core/hooks/use-lock-body-scroll";
import type { NglMessageItem } from "@/modules/ngl/services/api/ngl.service";
import { renderNglReplyCardBlob } from "@/modules/ngl/utils/ngl-share-image";
import {
    FiClock,
    FiDownload,
    FiMessageSquare,
    FiShare2,
    FiTrash2,
    FiX,
} from "react-icons/fi";

interface NglMessageModalProps {
    message: NglMessageItem | null;
    onClose: () => void;
    onDelete?: (id: string) => void;
    isDeleting?: boolean;
}

const MAX_REPLY_LENGTH = 300;

const NglMessageModal = ({
    message,
    onClose,
    onDelete,
    isDeleting,
}: NglMessageModalProps) => {
    const [replyMode, setReplyMode] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [shareFeedback, setShareFeedback] = useState<string | null>(null);

    useLockBodyScroll(Boolean(message));

    const domainLabel = (() => {
        try {
            return new URL(getNglUrl()).host;
        } catch {
            return "ngl.himaifubsismi.or.id";
        }
    })();

    useEffect(() => {
        setReplyMode(false);
        setReplyText("");
        setShareFeedback(null);
    }, [message?.id]);

    useEffect(() => {
        if (!message || !replyMode) {
            setImageBlob(null);
            setPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
            return;
        }

        let cancelled = false;
        const timer = setTimeout(async () => {
            setIsGenerating(true);
            try {
                const blob = await renderNglReplyCardBlob({
                    message: message.content,
                    reply: replyText,
                    domainLabel,
                });
                if (cancelled) return;
                const url = URL.createObjectURL(blob);
                setImageBlob(blob);
                setPreviewUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return url;
                });
            } catch {
                // ignore canvas errors
            } finally {
                if (!cancelled) setIsGenerating(false);
            }
        }, 180);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [message, replyMode, replyText, domainLabel]);

    if (!message) return null;

    const handleNativeShare = async () => {
        if (!imageBlob) return;
        const file = new File([imageBlob], `himaif-ngl-${message.id.slice(0, 8)}.png`, {
            type: "image/png",
        });

        if (navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "Balas Pesan Anonim HIMA-IF NGL",
                });
                return;
            } catch (err) {
                if ((err as Error)?.name === "AbortError") return;
            }
        }

        // Fallback: download PNG
        handleDownload();
        setShareFeedback(
            "Browser tidak mendukung bagikan langsung. Gambar telah diunduh agar bisa diunggah ke IG Story / Medsos!"
        );
    };

    const handleDownload = () => {
        if (!previewUrl) return;
        const a = document.createElement("a");
        a.href = previewUrl;
        a.download = `himaif-ngl-balas-${message.id.slice(0, 8)}.png`;
        a.click();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 py-6 overflow-y-auto overscroll-contain"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FiClock className="w-3.5 h-3.5 text-primary" />
                        <span>{formatTimestamp(message.created_at)}</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer transition"
                        aria-label="Tutup"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                    {/* Message Card Preview */}
                    <div className="rounded-2xl bg-gradient-to-br from-primary via-[#3b3fa8] to-indigo-600 p-5 text-center shadow-sm space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-white/95">
                            Pesan Anonim Masuk
                        </p>
                        <div className="rounded-xl bg-white/90 px-4 py-4 text-gray-900 font-semibold text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                        </div>
                    </div>

                    {/* Reply / Share Image Builder */}
                    {replyMode && (
                        <div className="space-y-4 pt-2 border-t border-gray-100">
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="ngl-reply-input"
                                        className="text-xs font-semibold text-gray-700"
                                    >
                                        Balasan Anda (Opsional)
                                    </label>
                                    <span className="text-[11px] text-gray-400">
                                        {replyText.length}/{MAX_REPLY_LENGTH}
                                    </span>
                                </div>
                                <textarea
                                    id="ngl-reply-input"
                                    rows={2}
                                    maxLength={MAX_REPLY_LENGTH}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Tulis balasan singkat untuk tampil di Story..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-gray-700">
                                    Pratinjau Gambar Story (9:16)
                                </p>
                                <div className="flex justify-center bg-gray-100 rounded-2xl p-3">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Pratinjau Kartu Balas NGL"
                                            className="w-48 aspect-[9/16] rounded-xl object-cover shadow-md"
                                        />
                                    ) : (
                                        <div className="w-48 aspect-[9/16] rounded-xl bg-gray-200 animate-pulse flex items-center justify-center text-xs text-gray-500">
                                            {isGenerating ? "Membuat gambar..." : "Memuat..."}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {shareFeedback && (
                                <p className="text-xs text-primary bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
                                    {shareFeedback}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    disabled={!imageBlob || isGenerating}
                                    onClick={handleNativeShare}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
                                >
                                    <FiShare2 className="w-4 h-4" />
                                    Bagikan ke Medsos
                                </button>
                                <button
                                    type="button"
                                    disabled={!previewUrl || isGenerating}
                                    onClick={handleDownload}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
                                >
                                    <FiDownload className="w-4 h-4" />
                                    Unduh PNG
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div>
                        {onDelete && (
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => onDelete(message.id)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                            >
                                <FiTrash2 className="w-3.5 h-3.5" />
                                {isDeleting ? "Menghapus..." : "Hapus"}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setReplyMode((prev) => !prev)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                replyMode
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-primary text-white hover:bg-primary/90"
                            }`}
                        >
                            <FiMessageSquare className="w-3.5 h-3.5" />
                            {replyMode ? "Tutup Balas" : "Balas & Bagikan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NglMessageModal;
