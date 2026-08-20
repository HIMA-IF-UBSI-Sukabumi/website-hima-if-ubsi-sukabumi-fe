'use client'

import { useState } from 'react'
import { CertificateData } from '../services/api/certificate.service'
import { formatTimestamp } from '@/lib/utils'
import {
    FiCheckCircle,
    FiXCircle,
    FiShield,
    FiPenTool,
    FiDownload,
    FiFileText,
    FiImage,
    FiCopy,
    FiCheck,
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
        <aside className="w-full space-y-5">
            {/* Status Verification Card */}
            <div
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all shadow-sm ${
                    data.is_valid
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500'
                        : 'bg-gradient-to-br from-rose-600 to-red-700 text-white border-rose-500'
                }`}
            >
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shrink-0">
                        {data.is_valid ? (
                            <FiCheckCircle className="w-6 h-6" />
                        ) : (
                            <FiXCircle className="w-6 h-6" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-emerald-800">
                                {data.is_valid ? 'TERVERIFIKASI SAH' : 'TIDAK VALID'}
                            </span>
                        </div>
                        <h2 className="text-base font-black text-white tracking-tight">
                            {data.is_valid
                                ? 'Sertifikat Resmi HIMA-IF'
                                : 'Sertifikat Tidak Ditemukan'}
                        </h2>
                        <p className="text-xs text-white/80 leading-relaxed">
                            {data.is_valid
                                ? 'Sertifikat ini terdaftar sah & terverifikasi resmi pada sistem basis data HIMA-IF UBSI Sukabumi.'
                                : 'Nomor sertifikat tidak cocok dengan catatan resmi sistem.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Certificate Details Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <FiShield className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary">
                        Informasi Sertifikat
                    </h3>
                </div>

                <div className="space-y-3 text-sm">
                    <div>
                        <span className="text-xs text-gray-400 font-medium block mb-1">
                            Nomor Sertifikat
                        </span>
                        <span className="font-mono font-bold text-gray-900 text-sm bg-smoky px-3 py-1.5 rounded-lg border border-gray-200/60 block break-all select-all">
                            {data.certificate_number}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                            <span className="text-xs text-gray-400 font-medium block">
                                Tanggal Terbit
                            </span>
                            <span className="font-bold text-gray-800 text-xs" suppressHydrationWarning>
                                {formatTimestamp(data.issued_at)}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-medium block">
                                Kode Verifikasi
                            </span>
                            <span className="font-mono font-bold text-gray-800 text-xs">
                                {data.short_code}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signers Section */}
            {sortedSigners.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                        <FiPenTool className="w-4 h-4 text-primary" />
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary">
                            Penandatangan ({sortedSigners.length})
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {sortedSigners.map((signer) => (
                            <div
                                key={signer.id || signer.name}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-primary/20 transition"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary text-white font-black overflow-hidden relative shrink-0 flex items-center justify-center text-sm shadow-sm">
                                    {signer.photo_url ? (
                                        <img
                                            src={signer.photo_url}
                                            alt={signer.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLElement).style.display = 'none'
                                            }}
                                        />
                                    ) : null}
                                    <span className="uppercase">{signer.name.charAt(0)}</span>
                                </div>
                                <div className="min-w-0">
                                    <h5 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                                        {signer.name}
                                    </h5>
                                    <p className="text-xs text-gray-500 font-medium truncate">
                                        {signer.position}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Downloads & Actions Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <FiDownload className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary">
                        Unduh Sertifikat
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {data.download_urls?.pdf && (
                        <a
                            href={data.download_urls.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition"
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
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold shadow-sm transition"
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
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                        >
                            <FiImage className="w-4 h-4" />
                            <span>PNG</span>
                        </a>
                    )}
                </div>

                <button
                    onClick={handleCopyUrl}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-smoky hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
                >
                    {copied ? (
                        <>
                            <FiCheck className="w-4 h-4 text-emerald-600" />
                            <span>Tautan Verifikasi Tersalin!</span>
                        </>
                    ) : (
                        <>
                            <FiCopy className="w-4 h-4 text-gray-500" />
                            <span>Salin Tautan Verifikasi</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    )
}
