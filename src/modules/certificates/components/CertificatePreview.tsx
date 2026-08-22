'use client'

import { useState, useRef } from 'react'
import { CertificateData } from '../services/api/certificate.service'
import {
    FiZoomIn,
    FiZoomOut,
    FiRotateCcw,
    FiMaximize2,
    FiMinimize2,
    FiDownload,
    FiExternalLink,
    FiAward,
    FiCheckCircle,
    FiImage
} from 'react-icons/fi'

interface CertificatePreviewProps {
    data: CertificateData
}

export const CertificatePreview = ({ data }: CertificatePreviewProps) => {
    const [zoom, setZoom] = useState(100)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [imgError, setImgError] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200))
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 50))
    const handleResetZoom = () => setZoom(100)

    const toggleFullscreen = () => {
        if (!containerRef.current) return
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
        }
    }

    const previewUrl = data.download_urls?.preview_image || data.download_urls?.jpg || data.download_urls?.png

    return (
        <div
            ref={containerRef}
            className={`relative bg-slate-900/90 dark:bg-slate-950/95 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl transition-all ${
                isFullscreen
                    ? 'fixed inset-0 z-50 rounded-none border-none'
                    : 'w-full min-h-[360px] sm:min-h-[440px] lg:min-h-[460px] xl:min-h-[540px]'
            }`}
        >
            {/* Control Bar Header (News Primary Theme) */}
            <div className="bg-primary text-white border-b border-primary/20 px-4 py-3 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold">
                    <FiAward className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Pratinjau Sertifikat</span>
                    <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                        {zoom}%
                    </span>
                </div>

                {/* Toolbar buttons */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 50}
                        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium flex items-center gap-1 transition"
                        title="Perkecil"
                    >
                        <FiZoomOut className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleResetZoom}
                        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium flex items-center gap-1 transition"
                        title="Reset Zoom"
                    >
                        <FiRotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 200}
                        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium flex items-center gap-1 transition"
                        title="Perbesar"
                    >
                        <FiZoomIn className="w-4 h-4" />
                    </button>

                    <div className="w-px h-4 bg-slate-800 mx-1" />

                    <button
                        onClick={toggleFullscreen}
                        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium flex items-center gap-1 transition"
                        title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
                    >
                        {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Viewer Workspace */}
            <div className="flex-1 overflow-auto p-3 sm:p-6 flex items-center justify-center bg-slate-950/60 relative custom-scrollbar min-h-[300px]">
                {/* Background Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                />

                {/* Certificate Display Box */}
                <div
                    className="transition-transform duration-200 ease-out max-w-full flex justify-center items-center"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
                >
                    {previewUrl && !imgError ? (
                        <div className="relative shadow-2xl rounded-xl overflow-hidden border border-slate-700/50 group">
                            <img
                                src={previewUrl}
                                alt={`Sertifikat ${data.recipient.name}`}
                                className="max-w-full h-auto max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-280px)] xl:max-h-[62vh] object-contain rounded-xl"
                                onError={() => setImgError(true)}
                            />

                            {/* Seal Overlay Badge */}
                            {data.is_valid && (
                                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-500/90 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm pointer-events-none">
                                    <FiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span>TERVERIFIKASI SAH</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Fallback Mock Decorative Certificate Visualizer */
                        <div className="w-full max-w-3xl aspect-[1.414/1] bg-amber-50/95 text-slate-900 p-4 sm:p-8 md:p-12 rounded-2xl shadow-2xl border-4 sm:border-8 border-indigo-900/80 relative flex flex-col justify-between overflow-hidden">
                            {/* Certificate Inner Ornamental Border */}
                            <div className="absolute inset-2 sm:inset-3 border sm:border-2 border-indigo-900/30 rounded-xl pointer-events-none flex flex-col justify-between p-2 sm:p-4">
                                <div className="flex justify-between">
                                    <div className="w-4 h-4 sm:w-8 sm:h-8 border-t sm:border-t-2 border-l sm:border-l-2 border-indigo-900" />
                                    <div className="w-4 h-4 sm:w-8 sm:h-8 border-t sm:border-t-2 border-r sm:border-r-2 border-indigo-900" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="w-4 h-4 sm:w-8 sm:h-8 border-b sm:border-b-2 border-l sm:border-l-2 border-indigo-900" />
                                    <div className="w-4 h-4 sm:w-8 sm:h-8 border-b sm:border-b-2 border-r sm:border-r-2 border-indigo-900" />
                                </div>
                            </div>

                            {/* Header */}
                            <div className="text-center space-y-1 sm:space-y-2 z-10">
                                <span className="text-[9px] sm:text-xs md:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-indigo-900 uppercase block">
                                    HIMA-IF UBSI PSDKU SUKABUMI
                                </span>
                                <h2 className="font-archivo text-base sm:text-2xl md:text-4xl text-slate-900 tracking-wider uppercase font-black">
                                    SERTIFIKAT
                                </h2>
                                <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-medium italic">
                                    Diberikan sebagai penghargaan kepada:
                                </p>
                            </div>

                            {/* Recipient Name */}
                            <div className="text-center my-2 sm:my-4 z-10">
                                <h3 className="text-sm sm:text-xl md:text-3xl font-extrabold text-indigo-950 border-b sm:border-b-2 border-indigo-900/40 inline-block px-3 sm:px-6 py-0.5 sm:py-1">
                                    {data.recipient.name}
                                </h3>
                                <p className="text-[10px] sm:text-xs md:text-sm text-slate-700 mt-1 sm:mt-3 max-w-xl mx-auto font-medium line-clamp-2">
                                    Atas partisipasi aktif dalam kegiatan <strong className="text-slate-900">{data.event.title}</strong>
                                </p>
                            </div>

                            {/* Footer & Signers */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-4 items-end z-10 pt-2 sm:pt-4">
                                <div className="text-left text-[9px] sm:text-[11px] text-slate-600 space-y-0.5 sm:space-y-1">
                                    <p className="font-mono font-semibold text-slate-900 truncate">
                                        No: {data.certificate_number}
                                    </p>
                                    <p suppressHydrationWarning className="truncate">Diterbitkan: {data.issued_at}</p>
                                </div>

                                <div className="flex justify-end gap-3 sm:gap-6 text-center text-[10px] sm:text-xs">
                                    {data.signers.slice(0, 2).map((s) => (
                                        <div key={s.id} className="space-y-0.5 sm:space-y-1">
                                            <div className="h-6 sm:h-10 flex items-center justify-center font-serif text-slate-400 italic text-[10px] sm:text-sm">
                                                (Tanda Tangan)
                                            </div>
                                            <p className="font-bold text-slate-900 border-t border-slate-400 pt-0.5 text-[9px] sm:text-xs truncate max-w-[100px] sm:max-w-none">
                                                {s.name}
                                            </p>
                                            <p className="text-[8px] sm:text-[10px] text-slate-600 truncate max-w-[100px] sm:max-w-none">{s.position}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative Watermark */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                                <FiAward className="w-48 h-48 sm:w-96 sm:h-96 text-indigo-950" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
