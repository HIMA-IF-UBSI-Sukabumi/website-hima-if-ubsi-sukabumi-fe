'use client'

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { FaInstagram } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FiArrowLeft, FiCheck, FiShare2 } from "react-icons/fi";
import ThemeToggle from "@/components/theme-toggle";

const emptySubscribe = () => () => {};
const getClientDate = () =>
    new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

const ProfileNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [copied, setCopied] = useState(false);
    const dateStr = useSyncExternalStore(emptySubscribe, getClientDate, () => "");

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const handleShare = () => {
        if (typeof window === "undefined" || !navigator.clipboard) return;
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <header className="w-full sticky top-0 z-50">
            {/* Top Utility Bar */}
            <div className="bg-primary text-white text-xs py-1.5 px-4 hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span className="bg-white text-primary font-extrabold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
                        Profil Talent
                    </span>
                    <p className="truncate font-medium text-white/90">
                        Portofolio Publik Mahasiswa &amp; Alumni HIMA-IF UBSI PSDKU Sukabumi
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Link
                        href="/"
                        className="hover:underline opacity-90 transition focus-visible:outline-2 focus-visible:outline-white rounded"
                    >
                        &larr; Kembali ke Portal Utama
                    </Link>
                    <span className="opacity-40" aria-hidden="true">|</span>
                    <span className="opacity-80">{dateStr}</span>
                </div>
            </div>

            {/* Main Header */}
            <div
                className={`bg-white dark:bg-slate-900 border-b border-gray-200/80 dark:border-slate-800 transition-shadow duration-200 ${
                    scrolled ? "shadow-sm" : ""
                }`}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 shrink-0 group focus-visible:outline-2 focus-visible:outline-primary rounded-lg"
                    >
                        <img
                            src="/assets/logo-himaif.webp"
                            alt="Logo HIMA-IF"
                            width={44}
                            height={44}
                            className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
                        />
                        <div className="leading-tight">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-lg sm:text-xl font-black text-primary dark:text-white tracking-tight group-hover:opacity-80 transition">
                                    HIMA<span className="text-secondary">-IF</span>
                                </span>
                                <span className="text-[10px] font-extrabold bg-primary text-white px-1.5 py-0.5 rounded tracking-wider uppercase">
                                    Talent
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                                UBSI PSDKU Sukabumi
                            </p>
                        </div>
                    </Link>

                    <nav aria-label="Navigasi profil" className="flex items-center gap-2 shrink-0">
                        <a
                            href="https://www.instagram.com/himaif.ubsismi"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram HIMA-IF"
                            className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition text-gray-600 dark:text-slate-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            <FaInstagram className="w-4 h-4" aria-hidden="true" />
                        </a>
                        <a
                            href="mailto:himaif.ubsismi@gmail.com"
                            aria-label="Email HIMA-IF"
                            className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition text-gray-600 dark:text-slate-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            <HiOutlineEnvelope className="w-4 h-4" aria-hidden="true" />
                        </a>

                        <div className="hidden sm:block">
                            <ThemeToggle />
                        </div>

                        <button
                            type="button"
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-indigo-200 hover:bg-primary/15 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                    <span className="text-emerald-700 dark:text-emerald-300">Tersalin</span>
                                </>
                            ) : (
                                <>
                                    <FiShare2 className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Bagikan</span>
                                </>
                            )}
                        </button>

                        <Link
                            href="/"
                            className="sm:hidden inline-flex items-center gap-1 min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            <FiArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Portal</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default ProfileNavbar;
