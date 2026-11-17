'use client'

import type { Candidate } from "@/modules/elections/services/api/elections.service";
import { resolveImageUrl } from "@/lib/utils";
import { useLockBodyScroll } from "@/core/hooks/use-lock-body-scroll";
import { FiAlertTriangle, FiShield, FiX } from "react-icons/fi";

interface VoteConfirmModalProps {
    isOpen: boolean;
    candidate: Candidate | null;
    electionTitle: string;
    isSubmitting: boolean;
    errorMessage: string | null;
    onConfirm: () => void;
    onClose: () => void;
}

const VoteConfirmModal = ({
    isOpen,
    candidate,
    electionTitle,
    isSubmitting,
    errorMessage,
    onConfirm,
    onClose,
}: VoteConfirmModalProps) => {
    useLockBodyScroll(Boolean(isOpen && candidate));

    if (!isOpen || !candidate) return null;

    const imageSrc = resolveImageUrl(candidate.photo_url || candidate.photo);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 overscroll-contain"
            onClick={() => !isSubmitting && onClose()}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">
                        Konfirmasi Pilihan Suara
                    </h2>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600:text-zinc-200 cursor-pointer disabled:opacity-50"
                        aria-label="Tutup"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-xs text-gray-500">
                        Pemilu: <span className="font-semibold text-gray-700">{electionTitle}</span>
                    </p>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt={candidate.name}
                                className="w-16 h-16 rounded-xl object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-archivo text-xl shrink-0">
                                {candidate.number}
                            </div>
                        )}
                        <div>
                            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                                Paslon #{candidate.number}
                            </span>
                            <h3 className="text-base font-bold text-gray-900">
                                {candidate.name}
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                        <FiShield className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>
                            Suara yang sudah dikirim bersifat <strong>rahasia (secret ballot)</strong> dan{" "}
                            <strong>tidak dapat diubah</strong> setelah dikonfirmasi.
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                            <FiAlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200/70:bg-zinc-800 transition cursor-pointer disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition cursor-pointer disabled:opacity-60"
                    >
                        {isSubmitting ? "Mengirim Suara..." : "Ya, Kirim Suara Saya"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteConfirmModal;
