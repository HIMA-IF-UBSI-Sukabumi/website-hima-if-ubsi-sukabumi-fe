'use client'

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useAuthStore, useIsAuthenticated } from "@/core/stores/use-auth-store";
import { useSsoLogout } from "@/core/hooks/use-sso-logout";
import { getConsoleUrl, getSsoLoginUrl, resolveImageUrl } from "@/lib/utils";
import { FaInstagram } from "react-icons/fa6";
import { HiOutlineArrowTopRightOnSquare, HiOutlineEnvelope } from "react-icons/hi2";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";

const TICKER_MESSAGES = [
    "Selamat datang di SuaraMu – Platform E-Voting resmi HIMA-IF UBSI PSDKU Sukabumi",
    "Gunakan hak pilihmu secara langsung, jujur, bebas, dan rahasia",
    "Masuk menggunakan akun SSO mahasiswa HIMA-IF untuk mengakses bilik suara",
];

const emptySubscribe = () => () => {};
const getClientDate = () =>
    new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

const ElectionsNavbar = () => {
    const user = useAuthStore((s) => s.user);
    const audience = useAuthStore((s) => s.audience);
    const { isLoggedIn } = useIsAuthenticated();
    const isSsoLoggedIn = isLoggedIn && Boolean(audience);
    const { logout: handleLogout, loggingOut } = useSsoLogout("elections");

    const [scrolled, setScrolled] = useState(false);
    const [tickerIndex, setTickerIndex] = useState(0);
    const dateStr = useSyncExternalStore(emptySubscribe, getClientDate, () => "");

    const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <header className="w-full sticky top-0 z-50">
            {/* Top Utility Bar */}
            <div className="bg-primary text-white text-xs py-1.5 px-4 hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span className="bg-white text-primary font-extrabold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
                        E-Voting
                    </span>
                    <div className="overflow-hidden flex-1">
                        <p
                            key={tickerIndex}
                            className="truncate animate-[fadeIn_0.5s_ease] font-medium"
                        >
                            {TICKER_MESSAGES[tickerIndex]}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    <a href={mainSiteUrl} className="hover:underline opacity-80 transition">
                        &larr; Kembali ke Portal
                    </a>
                    <span className="opacity-40">|</span>
                    <span className="opacity-70">{dateStr}</span>
                </div>
            </div>

            {/* Main Header */}
            <div
                className={`bg-white border-b border-gray-100 transition-shadow duration-200 ${
                    scrolled ? "shadow-md" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <img
                            src="/assets/logo-himaif.webp"
                            alt="HIMA-IF"
                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        />
                        <div className="leading-tight">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-lg sm:text-xl font-black text-primary tracking-tight group-hover:opacity-80 transition">
                                    HIMA<span className="text-secondary">-IF</span>
                                </span>
                                <span className="text-xs font-extrabold bg-primary text-white px-1.5 py-0.5 rounded tracking-wider uppercase">
                                    SuaraMu
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">
                                UBSI PSDKU Sukabumi
                            </p>
                        </div>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <a
                            href="https://www.instagram.com/himaif.ubsismi"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram HIMA-IF"
                            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-smoky transition text-gray-500 hover:text-primary"
                        >
                            <FaInstagram className="w-4 h-4" />
                        </a>
                        <a
                            href="mailto:himaif.ubsismi@gmail.com"
                            aria-label="Email HIMA-IF"
                            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-smoky transition text-gray-500 hover:text-primary"
                        >
                            <HiOutlineEnvelope className="w-4 h-4" />
                        </a>

                        {isLoggedIn && user ? (
                            <div className="flex items-center gap-2 ml-1">
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-smoky/70 border border-gray-200/80">
                                    {user.profile_picture ? (
                                        <img
                                            src={resolveImageUrl(user.profile_picture)}
                                            alt={user.name}
                                            className="w-6 h-6 rounded-full object-cover shrink-0"
                                        />
                                    ) : (
                                        <FiUser className="w-3.5 h-3.5 text-primary" />
                                    )}
                                    <div className="text-xs leading-tight">
                                        <p className="font-semibold text-gray-800 truncate max-w-[130px]">
                                            {user.name}
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            {user.nim}
                                        </p>
                                    </div>
                                </div>
                                {isSsoLoggedIn && (
                                    <a
                                        href={getConsoleUrl()}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 transition"
                                        title="Kembali ke Console"
                                    >
                                        <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Kembali ke Console</span>
                                        <span className="sm:hidden">Console</span>
                                    </a>
                                )}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                                    title="Keluar"
                                >
                                    <FiLogOut className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Keluar</span>
                                </button>
                            </div>
                        ) : (
                            <a
                                href={getSsoLoginUrl("elections")}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-white hover:bg-primary/90 shadow-xs transition ml-1"
                            >
                                <FiLogIn className="w-4 h-4" />
                                <span>Masuk SSO</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ElectionsNavbar;
