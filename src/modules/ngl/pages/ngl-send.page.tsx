'use client'

import { useState } from "react";
import Link from "next/link";
import { useAuthStore, useIsAuthenticated } from "@/core/stores/use-auth-store";
import { getNglUrl, getSsoLoginUrl } from "@/lib/utils";
import NglSendForm from "@/modules/ngl/components/NglSendForm";
import NglShareLinkModal from "@/modules/ngl/components/NglShareLinkModal";
import { FiCheck, FiCopy, FiInbox, FiLock, FiLogIn, FiMessageCircle, FiShare2, FiShield } from "react-icons/fi";

interface ModuleNglSendPageProps {
    initialNim?: string;
}

const ModuleNglSendPage = ({ initialNim }: ModuleNglSendPageProps) => {
    const user = useAuthStore((s) => s.user);
    const { isLoggedIn } = useIsAuthenticated();
    const [copied, setCopied] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);

    const isAdmin = isLoggedIn && Boolean(user?.roles?.includes("admin"));
    const shareUrl = isAdmin
        ? getNglUrl()
        : user?.nim
        ? getNglUrl(`/${user.nim}`)
        : "";

    const handleCopyLink = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore clipboard errors
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
            {/* Hero */}
            <section className="text-center space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
                    <FiMessageCircle className="w-3.5 h-3.5" />
                    HIMA-IF Anonymous NGL
                </span>
                <h1 className="font-archivo text-2xl sm:text-4xl text-gray-900">
                    Kirim Pesan Anonim
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                    Sampaikan pesan rahasia untuk sesama mahasiswa Informatika atau kirimkan
                    aspirasi langsung ke pengurus HIMA-IF tanpa diketahui identitasmu.
                </p>
            </section>

            {/* Shareable personal link banner when logged in */}
            {isLoggedIn && user ? (
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-primary">
                            {isAdmin ? "Link NGL Resmi HIMA-IF" : "Link NGL Pribadi Anda"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                            {shareUrl}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-primary/40 transition cursor-pointer"
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    Tersalin
                                </>
                            ) : (
                                <>
                                    <FiCopy className="w-3.5 h-3.5" />
                                    Salin Link
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShareModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition cursor-pointer"
                        >
                            <FiShare2 className="w-3.5 h-3.5" />
                            Bagikan ke Medsos
                        </button>
                        <Link
                            href="/inbox"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition"
                        >
                            <FiInbox className="w-3.5 h-3.5" />
                            Buka Inbox
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-600">
                        Ingin membaca pesan anonim yang masuk untukmu?
                    </p>
                    <a
                        href={getSsoLoginUrl("ngl")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition"
                    >
                        <FiLogIn className="w-3.5 h-3.5" />
                        Masuk via SSO
                    </a>
                </div>
            )}

            <NglSendForm initialNim={initialNim} />

            {/* Privacy & How Messages Are Stored Notice */}
            <section className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FiShield className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm sm:text-base font-bold text-gray-900">
                            100% Rahasia &amp; Tanpa Jejak Pengirim
                        </h2>
                        <p className="text-xs text-gray-500">
                            Bagaimana sistem HIMA-IF NGL menyimpan pesanmu?
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                        <p className="font-bold text-gray-900 flex items-center gap-1.5">
                            <FiLock className="w-3.5 h-3.5 text-primary shrink-0" />
                            Tanpa Identitas Pengirim
                        </p>
                        <p className="leading-relaxed">
                            Database hanya menyimpan isi pesan, waktu kirim, dan status baca.
                            Tidak ada kolom nama, NIM, atau ID pengirim.
                        </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                        <p className="font-bold text-gray-900">
                            Kirim Tanpa Login
                        </p>
                        <p className="leading-relaxed">
                            Pengiriman pesan berjalan di endpoint publik tanpa token akun,
                            sehingga sesi login Anda tidak pernah ditautkan ke pesan.
                        </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                        <p className="font-bold text-gray-900">
                            Token Penerima Sekali Pakai
                        </p>
                        <p className="leading-relaxed">
                            Pencarian NIM hanya menghasilkan token acak 15 menit yang langsung
                            hangus setelah 1 pesan terkirim, dengan nama penerima disamarkan.
                        </p>
                    </div>
                </div>
            </section>
            <NglShareLinkModal
                isOpen={shareModalOpen}
                shareUrl={shareUrl}
                displayName={user?.name}
                profilePicture={user?.profile_picture}
                isAdmin={isAdmin}
                onClose={() => setShareModalOpen(false)}
            />
        </div>
    );
};

export default ModuleNglSendPage;
