'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
    FiCheckCircle,
    FiXCircle,
    FiShare2,
    FiCheck,
    FiShield,
    FiArrowLeft,
    FiCopy,
    FiFileText,
    FiImage
} from 'react-icons/fi'
import { HiBars3, HiXMark } from 'react-icons/hi2'
import { FaInstagram } from 'react-icons/fa6'
import { HiOutlineEnvelope } from 'react-icons/hi2'

interface CertificateNavbarProps {
    certificateNumber?: string
    isValid?: boolean
    verificationUrl?: string
    downloadUrls?: {
        pdf?: string
        jpg?: string
        png?: string
    }
}

export const CertificateNavbar = ({
    certificateNumber,
    isValid = true,
    verificationUrl,
    downloadUrls,
}: CertificateNavbarProps) => {
    const [copied, setCopied] = useState(false)
    const [dateStr, setDateStr] = useState('')
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        setDateStr(
            new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
        )
    }, [])

    const handleShare = () => {
        const url = verificationUrl || (typeof window !== 'undefined' ? window.location.href : '')
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            })
        }
    }

    const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    return (
        <header className="w-full sticky top-0 z-50 shadow-sm bg-white">
            {/* Top Bar Ticker (Hidden on very small screens, visible on sm+) */}
            <div className="bg-primary text-white text-xs py-1.5 px-4 hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span className="bg-white text-primary font-extrabold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
                        VERIFIKASI
                    </span>
                    <p className="truncate font-medium text-white/90 text-xs">
                        Portal Resmi Verifikasi Keabsahan Sertifikat HIMA-IF UBSI PSDKU Sukabumi
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    <a href={mainSiteUrl} className="hover:underline opacity-90 transition">
                        ← Kembali ke Portal Utama
                    </a>
                    <span className="opacity-40">|</span>
                    <span className="opacity-80" suppressHydrationWarning>{dateStr}</span>
                </div>
            </div>

            {/* Main Header Container */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">

                    {/* Left: Brand Logo & Title */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
                            <img
                                src="/assets/logo-himaif.webp"
                                alt="HIMA-IF"
                                className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                            />
                            <div className="leading-tight">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-base sm:text-xl font-black text-primary tracking-tight group-hover:opacity-80 transition">
                                        HIMA<span className="text-secondary">-IF</span>
                                    </span>
                                    <span className="text-[10px] sm:text-xs font-extrabold bg-primary text-white px-1.5 py-0.5 rounded tracking-wider uppercase">
                                        VERIFY
                                    </span>
                                </div>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium">UBSI PSDKU Sukabumi</p>
                            </div>
                        </Link>

                        {certificateNumber && (
                            <div className="hidden lg:flex items-center border-l border-gray-200 pl-3 ml-1">
                                <span className="font-mono text-xs font-bold text-gray-600 bg-smoky px-2.5 py-1 rounded-md border border-gray-200/60 truncate max-w-[180px] xl:max-w-none">
                                    {certificateNumber}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
                        {isValid !== undefined && (
                            <div
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                    isValid
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-rose-500 text-white'
                                }`}
                            >
                                {isValid ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiXCircle className="w-3.5 h-3.5" />}
                                <span>{isValid ? 'Sertifikat Valid' : 'Tidak Valid'}</span>
                            </div>
                        )}

                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-smoky hover:bg-gray-200 text-gray-700 text-xs font-bold transition"
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Tersalin</span>
                                </>
                            ) : (
                                <>
                                    <FiShare2 className="w-3.5 h-3.5 text-gray-500" />
                                    <span>Bagikan</span>
                                </>
                            )}
                        </button>

                        <a
                            href="https://www.instagram.com/himaif.ubsismi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-smoky transition text-gray-500 hover:text-primary"
                            title="Instagram HIMA-IF"
                        >
                            <FaInstagram className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Mobile Hamburger Toggle (md:hidden) */}
                    <div className="flex md:hidden items-center gap-2">
                        {isValid !== undefined && (
                            <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${
                                    isValid ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                            >
                                {isValid ? <FiCheckCircle className="w-3 h-3" /> : <FiXCircle className="w-3 h-3" />}
                                <span>{isValid ? 'Valid' : 'Invalid'}</span>
                            </span>
                        )}

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-smoky hover:bg-gray-200 text-gray-700 transition"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <HiXMark className="w-5 h-5" /> : <HiBars3 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Drawer (md:hidden) */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 shadow-xl animate-[fadeIn_0.2s_ease]">
                    <div className="px-4 py-4 space-y-3">
                        {certificateNumber && (
                            <div className="p-3 bg-smoky rounded-xl border border-gray-200/60">
                                <span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                                    Nomor Sertifikat
                                </span>
                                <span className="font-mono text-xs font-bold text-gray-900 break-all select-all">
                                    {certificateNumber}
                                </span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                                onClick={() => {
                                    handleShare()
                                    setMobileOpen(false)
                                }}
                                className="flex items-center justify-center gap-2 p-2.5 bg-smoky hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
                            >
                                {copied ? <FiCheck className="w-4 h-4 text-emerald-600" /> : <FiCopy className="w-4 h-4" />}
                                <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
                            </button>

                            <a
                                href={mainSiteUrl}
                                className="flex items-center justify-center gap-1.5 p-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition"
                            >
                                <FiArrowLeft className="w-3.5 h-3.5" />
                                <span>Portal Utama</span>
                            </a>
                        </div>

                        {/* Quick Download buttons on mobile if available */}
                        {downloadUrls && (
                            <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-2">
                                {downloadUrls.pdf && (
                                    <a
                                        href={downloadUrls.pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 p-2 bg-primary text-white rounded-lg text-xs font-bold"
                                    >
                                        <FiFileText className="w-3.5 h-3.5" />
                                        <span>PDF</span>
                                    </a>
                                )}
                                {downloadUrls.jpg && (
                                    <a
                                        href={downloadUrls.jpg}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 p-2 bg-secondary text-white rounded-lg text-xs font-bold"
                                    >
                                        <FiImage className="w-3.5 h-3.5" />
                                        <span>JPG</span>
                                    </a>
                                )}
                                {downloadUrls.png && (
                                    <a
                                        href={downloadUrls.png}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 p-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                                    >
                                        <FiImage className="w-3.5 h-3.5" />
                                        <span>PNG</span>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
