'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
    CertificateData,
} from '../services/api/certificate.service'
import { formatDate, formatTimestamp } from '@/lib/utils'
import {
    FiCheckCircle,
    FiXCircle,
    FiUser,
    FiCalendar,
    FiMapPin,
    FiAward,
    FiDownload,
    FiFileText,
    FiImage,
    FiCopy,
    FiCheck,
    FiMail,
    FiTag,
    FiPenTool,
    FiShield,
    FiExternalLink
} from 'react-icons/fi'

interface CertificateSidebarProps {
    data: CertificateData
}

export const CertificateSidebar = ({ data }: CertificateSidebarProps) => {
    const [copied, setCopied] = useState(false)

    const handleCopyUrl = () => {
        const url = data.verification_url || (typeof window !== 'undefined' ? window.location.href : '')
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            })
        }
    }

    const sortedSigners = [...(data.signers || [])].sort(
        (a, b) => (a.signing_order || 0) - (b.signing_order || 0)
    )

    return (
        <aside className="w-full space-y-6">
            {/* Status Verification Card */}
            <div
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all ${data.is_valid
                        ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-gradient-to-br from-rose-50 to-red-50/50 dark:from-rose-950/40 dark:to-red-950/20 border-rose-200 dark:border-rose-800/60'
                    }`}
            >
                <div className="flex items-start gap-4">
                    <div
                        className={`p-3 rounded-xl shrink-0 ${data.is_valid
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                : 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                            }`}
                    >
                        {data.is_valid ? (
                            <FiCheckCircle className="w-6 h-6" />
                        ) : (
                            <FiXCircle className="w-6 h-6" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${data.is_valid
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300'
                                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-300'
                                    }`}
                            >
                                {data.is_valid ? 'Terverifikasi' : 'Tidak Valid'}
                            </span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            {data.is_valid
                                ? 'Sertifikat Resmi & Sah'
                                : 'Sertifikat Tidak Ditemukan / Kadaluwarsa'}
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {data.is_valid
                                ? 'Sertifikat ini telah terdaftar resmi di basis data HIMA-IF UBSI Sukabumi.'
                                : 'Tanda tangan atau nomor sertifikat ini tidak cocok dengan catatan sistem.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Certificate Details Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <FiShield className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Informasi Sertifikat
                    </h3>
                </div>

                <div className="space-y-3 text-sm">
                    <div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 block">
                            Nomor Sertifikat
                        </span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 break-all select-all">
                            {data.certificate_number}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                            <span className="text-xs text-slate-400 dark:text-slate-500 block">
                                Tanggal Terbit
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                {formatTimestamp(data.issued_at)}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 dark:text-slate-500 block">
                                Kode Verifikasi
                            </span>
                            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                                {data.short_code}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <FiUser className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Penerima Sertifikat
                    </h3>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold shrink-0">
                            {data.recipient.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
                                {data.recipient.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                                <FiMail className="w-3 h-3 shrink-0" />
                                <span className="truncate">{data.recipient.email}</span>
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Status Peserta</span>
                        <span
                            className={`px-2.5 py-0.5 rounded-full font-medium ${data.recipient.is_guest
                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                    : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                }`}
                        >
                            {data.recipient.is_guest ? 'Tamu / Umum' : 'Mahasiswa / Anggota'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Event Details */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <FiAward className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Kegiatan / Event
                    </h3>
                </div>

                <div className="space-y-3 text-sm">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                        {data.event.title}
                    </h4>

                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-start gap-2">
                            <FiCalendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                                <span>{formatDate(data.event.start_date)}</span>
                                {data.event.end_date && data.event.end_date !== data.event.start_date && (
                                    <span className="block text-slate-400">
                                        s/d {formatDate(data.event.end_date)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FiMapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span>{data.event.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signers Section */}
            {sortedSigners.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <FiPenTool className="w-4 h-4 text-primary" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Penandatangan ({sortedSigners.length})
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {sortedSigners.map((signer) => (
                            <div
                                key={signer.id || signer.name}
                                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative shrink-0 flex items-center justify-center text-slate-500 font-bold">
                                    {signer.photo_url ? (
                                        <img
                                            src={signer.photo_url}
                                            alt={signer.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback if image load fails
                                                (e.currentTarget as HTMLElement).style.display = 'none'
                                            }}
                                        />
                                    ) : null}
                                    <span className="uppercase">{signer.name.charAt(0)}</span>
                                </div>
                                <div className="min-w-0">
                                    <h5 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                                        {signer.name}
                                    </h5>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {signer.position}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Downloads & Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 pb-2">
                    <FiDownload className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Unduh Sertifikat
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {data.download_urls?.pdf && (
                        <a
                            href={data.download_urls.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                        >
                            <FiFileText className="w-4 h-4" />
                            <span>PDF</span>
                        </a>
                    )}
                    {data.download_urls?.jpg && (
                        <a
                            href={data.download_urls.jpg}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                        >
                            <FiImage className="w-4 h-4" />
                            <span>JPG</span>
                        </a>
                    )}
                    {data.download_urls?.png && (
                        <a
                            href={data.download_urls.png}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                        >
                            <FiImage className="w-4 h-4" />
                            <span>PNG</span>
                        </a>
                    )}
                </div>

                <button
                    onClick={handleCopyUrl}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
                >
                    {copied ? (
                        <>
                            <FiCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Link Verifikasi Tersalin!</span>
                        </>
                    ) : (
                        <>
                            <FiCopy className="w-4 h-4" />
                            <span>Salin Tautan Verifikasi</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    )
}
