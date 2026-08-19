'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiCheckCircle, FiShare2, FiShield, FiArrowLeft, FiCopy, FiCheck } from 'react-icons/fi'

interface CertificateNavbarProps {
    certificateNumber?: string
    isValid?: boolean
    verificationUrl?: string
}

export const CertificateNavbar = ({
    certificateNumber,
    isValid = true,
    verificationUrl,
}: CertificateNavbarProps) => {
    const [copied, setCopied] = useState(false)

    const handleShare = () => {
        const url = verificationUrl || (typeof window !== 'undefined' ? window.location.href : '')
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            })
        }
    }

    return (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Left: Brand & Back */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <Link
                        href="/"
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Kembali ke Beranda"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </Link>

                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
                            <FiShield className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                                Verifikasi Sertifikat
                            </h1>
                            {certificateNumber && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono">
                                    {certificateNumber}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Status Badge */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {isValid !== undefined && (
                        <div
                            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${isValid
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                                }`}
                        >
                            <FiCheckCircle className="w-3.5 h-3.5" />
                            <span>{isValid ? 'Sertifikat Valid' : 'Tidak Valid'}</span>
                        </div>
                    )}

                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition"
                    >
                        {copied ? (
                            <>
                                <FiCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="hidden sm:inline">Tersalin</span>
                            </>
                        ) : (
                            <>
                                <FiShare2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Bagikan</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}
