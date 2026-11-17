'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore, useIsAuthenticated } from "@/core/stores/use-auth-store";
import { useAuthAxios } from "@/core/hooks/use-auth-axios";
import { authService } from "@/core/services/auth.service";
import { getSsoLoginUrl, resolveImageUrl } from "@/lib/utils";
import { FaInstagram } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FiInbox, FiLogIn, FiLogOut, FiSend, FiShield, FiUser } from "react-icons/fi";

const TICKER_MESSAGES = [
    "Selamat datang di HIMA-IF NGL – Kirim pesan anonim secara aman",
    "Sampaikan aspirasi, kritik membangun, atau sapaan untuk temanmu",
    "Identitas pengirim 100% dirahasiakan oleh sistem",
];

const NglNavbar = () => {
    const pathname = usePathname();
    const authAxios = useAuthAxios();
    const user = useAuthStore((s) => s.user);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const { isLoggedIn } = useIsAuthenticated();

    const [loggingOut, setLoggingOut] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [tickerIndex, setTickerIndex] = useState(0);
    const [dateStr, setDateStr] = useState("");

    const isAdmin = isLoggedIn && Boolean(user?.roles?.includes("admin"));
    const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    useEffect(() => {
        setDateStr(
            new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            })
        );
    }, []);

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

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await authService.logout(authAxios);
        } catch {
            // ignore
        } finally {
            clearAuth();
            setLoggingOut(false);
        }
    };

    const isInbox = pathname === "/inbox" || pathname === "/ngl/inbox";
    const isAdminRoute = pathname === "/admin" || pathname === "/ngl/admin";
    const isSend = !isInbox && !isAdminRoute;

    return (
        <header className="w-full sticky top-0 z-50">
            {/* Top Utility Bar */}
            <div className="bg-primary text-white text-xs py-1.5 px-4 hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span className="bg-white text-primary font-extrabold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
                        Anonim
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
                                    NGL
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">
                                UBSI PSDKU Sukabumi
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/"
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                                isSend
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-smoky"
                            }`}
                        >
                            <FiSend className="w-4 h-4" />
                            Kirim Pesan
                        </Link>

                        <Link
                            href="/inbox"
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                                isInbox
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-smoky"
                            }`}
                        >
                            <FiInbox className="w-4 h-4" />
                            Inbox Saya
                        </Link>

                        {isAdmin && (
                            <Link
                                href="/admin"
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                                    isAdminRoute
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-600 hover:bg-smoky"
                                }`}
                            >
                                <FiShield className="w-4 h-4" />
                                Moderasi Admin
                            </Link>
                        )}
                    </nav>

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
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                                >
                                    <FiLogOut className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Keluar</span>
                                </button>
                            </div>
                        ) : (
                            <a
                                href={getSsoLoginUrl("ngl")}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-white hover:bg-primary/90 shadow-xs transition ml-1"
                            >
                                <FiLogIn className="w-4 h-4" />
                                <span>Masuk SSO</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-gray-100 px-4 py-2 flex items-center gap-2 overflow-x-auto bg-white">
                    <Link
                        href="/"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
                            isSend ? "bg-primary/10 text-primary" : "text-gray-600"
                        }`}
                    >
                        <FiSend className="w-3.5 h-3.5" />
                        Kirim Pesan
                    </Link>
                    <Link
                        href="/inbox"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
                            isInbox ? "bg-primary/10 text-primary" : "text-gray-600"
                        }`}
                    >
                        <FiInbox className="w-3.5 h-3.5" />
                        Inbox Saya
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
                                isAdminRoute ? "bg-primary/10 text-primary" : "text-gray-600"
                            }`}
                        >
                            <FiShield className="w-3.5 h-3.5" />
                            Admin
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NglNavbar;
