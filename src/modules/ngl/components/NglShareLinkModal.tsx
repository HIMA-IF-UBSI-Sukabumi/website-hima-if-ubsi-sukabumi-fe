'use client'

import { useEffect, useState } from "react";
import { getNglUrl, resolveImageUrl } from "@/lib/utils";
import { useLockBodyScroll } from "@/core/hooks/use-lock-body-scroll";
import { renderNglShareLinkBlob } from "@/modules/ngl/utils/ngl-share-image";
import { FiCheck, FiCopy, FiDownload, FiShare2, FiX } from "react-icons/fi";

interface NglShareLinkModalProps {
    isOpen: boolean;
    shareUrl: string;
    displayName?: string;
    profilePicture?: string | null;
    isAdmin?: boolean;
    onClose: () => void;
}

const NglShareLinkModal = ({
    isOpen,
    shareUrl,
    displayName,
    profilePicture,
    isAdmin = false,
    onClose,
}: NglShareLinkModalProps) => {
    const [copied, setCopied] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [shareFeedback, setShareFeedback] = useState<string | null>(null);
    const isGenerating = isOpen && !previewUrl;

    useLockBodyScroll(isOpen);

    const domainLabel = (() => {
        try {
            return new URL(shareUrl || getNglUrl()).host;
        } catch {
            return "ngl.himaifubsismi.or.id";
        }
    })();

    useEffect(() => {
        if (!isOpen || !shareUrl) return;

        // Auto-copy link when opening modal
        navigator.clipboard?.writeText(shareUrl).then(() => {
            setCopied(true);
        }).catch(() => {
            // ignore clipboard permission errors
        });

        let cancelled = false;

        renderNglShareLinkBlob({
            displayName,
            profilePictureUrl: resolveImageUrl(profilePicture) || undefined,
            isAdmin,
            domainLabel,
        })
            .then((blob) => {
                if (cancelled) return;
                const url = URL.createObjectURL(blob);
                setImageBlob(blob);
                setShareFeedback(null);
                setPreviewUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return url;
                });
            })
            .catch(() => {
                // ignore
            });

        return () => {
            cancelled = true;
        };
    }, [isOpen, shareUrl, displayName, profilePicture, isAdmin, domainLabel]);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    const handleDownload = () => {
        if (!previewUrl) return;
        const a = document.createElement("a");
        a.href = previewUrl;
        a.download = "himaif-ngl-link-story.png";
        a.click();
    };

    const handleShare = async () => {
        if (!imageBlob) return;
        const file = new File([imageBlob], "himaif-ngl-link-story.png", {
            type: "image/png",
        });

        if (navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "Kirim Pesan Anonim untukku di HIMA-IF NGL",
                    text: `Kirim pesan anonim untukku di ${shareUrl}`,
                });
                return;
            } catch (err) {
                if ((err as Error)?.name === "AbortError") return;
            }
        }

        handleDownload();
        setShareFeedback(
            "Gambar telah diunduh & link sudah disalin! Unggah gambar ke IG Story lalu tempel stiker Link."
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 py-6 overflow-y-auto overscroll-contain"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">
                        Bagikan Link NGL ke Medsos
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        aria-label="Tutup"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Copied Link Banner */}
                    <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                        <div className="min-w-0">
                            <p className="font-bold">
                                {copied
                                    ? "Link otomatis disalin ke clipboard!"
                                    : "Link NGL Pribadi Anda"}
                            </p>
                            <p className="truncate opacity-80">{shareUrl}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 font-semibold shrink-0 cursor-pointer hover:bg-emerald-100/50 transition"
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="w-3.5 h-3.5" />
                                    Tersalin
                                </>
                            ) : (
                                <>
                                    <FiCopy className="w-3.5 h-3.5" />
                                    Salin
                                </>
                            )}
                        </button>
                    </div>

                    {/* Story Preview */}
                    <div className="flex justify-center bg-gray-100 rounded-2xl p-3">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Pratinjau Story Link NGL"
                                className="w-48 aspect-[9/16] rounded-xl object-cover shadow-md"
                            />
                        ) : (
                            <div className="w-48 aspect-[9/16] rounded-xl bg-gray-200 animate-pulse flex items-center justify-center text-xs text-gray-500">
                                {isGenerating ? "Membuat gambar..." : "Memuat..."}
                            </div>
                        )}
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
                            onClick={handleShare}
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
            </div>
        </div>
    );
};

export default NglShareLinkModal;
