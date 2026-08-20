'use client'

import { useQuery } from '@tanstack/react-query'
import useAxios from '@/core/hooks/use-axios'
import {
    certificateService,
    CertificateData,
} from '../services/api/certificate.service'
import { CertificateNavbar } from '../components/CertificateNavbar'
import { CertificateSidebar } from '../components/CertificateSidebar'
import { CertificatePreview } from '../components/CertificatePreview'
import NewsFooter from '@/modules/news/components/NewsFooter'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import {
    FiArrowLeft,
    FiAlertTriangle,
    FiUser,
    FiMail,
    FiAward,
    FiCalendar,
    FiMapPin
} from 'react-icons/fi'

interface ModuleCertificateVerifyPageProps {
    code: string
}

export default function ModuleCertificateVerifyPage({ code }: ModuleCertificateVerifyPageProps) {
    const axios = useAxios()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['certificate-verify', code],
        queryFn: async () => {
            const res = await certificateService.verifyByCode(axios, code)
            if (res && res.success && res.data) {
                return res.data
            }
            throw new Error(res?.message || 'Sertifikat tidak valid')
        },
        retry: 1,
        staleTime: 5 * 60 * 1000,
    })

    const certificateData: CertificateData | undefined = data

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 text-slate-900 flex flex-col">
                <CertificateNavbar />
                <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-32">
                                <div className="bg-gray-200 rounded-2xl" />
                                <div className="bg-gray-200 rounded-2xl" />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-2xl min-h-[450px]" />
                        </div>
                        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                            <div className="h-28 bg-gray-200 rounded-2xl" />
                            <div className="h-44 bg-gray-200 rounded-2xl" />
                            <div className="h-36 bg-gray-200 rounded-2xl" />
                        </div>
                    </div>
                </main>
                <NewsFooter />
            </div>
        )
    }

    if (isError && !certificateData) {
        return (
            <div className="min-h-screen bg-gray-50/50 text-slate-900 flex flex-col">
                <CertificateNavbar />
                <main className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6 flex-1">
                    <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                        <FiAlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            Sertifikat Tidak Ditemukan
                        </h2>
                        <p className="text-sm text-gray-500 max-w-md mx-auto font-medium">
                            Kode sertifikat <code className="font-mono bg-gray-200 px-2 py-0.5 rounded text-rose-600 font-bold">{code}</code> tidak terdaftar atau telah dicabut.
                        </p>
                    </div>
                    <div className="pt-4 flex items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition shadow-md shadow-primary/20"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>
                </main>
                <NewsFooter />
            </div>
        )
    }

    if (!certificateData) return null

    return (
        <div className="min-h-screen lg:h-screen bg-gray-50/50 text-slate-900 flex flex-col overflow-x-hidden">
            {/* Top News Style Navbar */}
            <CertificateNavbar
                certificateNumber={certificateData.certificate_number}
                isValid={certificateData.is_valid}
                verificationUrl={certificateData.verification_url}
                downloadUrls={certificateData.download_urls}
            />

            {/* Main Content Workspace */}
            <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 lg:overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">

                    {/* Main Left Content: Recipient + Event Cards + Certificate Preview Canvas (NON-SCROLLABLE ON DESKTOP) */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full min-h-0 overflow-hidden order-1">

                        {/* Top Cards: Recipient & Event (News Badge Styling) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0 mb-4">
                            {/* Recipient Card */}
                            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <FiUser className="w-4 h-4 text-primary" />
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary">
                                            Penerima Sertifikat
                                        </h3>
                                    </div>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${
                                            certificateData.recipient.is_guest
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-primary/10 text-primary'
                                        }`}
                                    >
                                        {certificateData.recipient.is_guest ? 'Tamu' : 'Mahasiswa'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center text-base font-black shrink-0 shadow-sm">
                                        {certificateData.recipient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-black text-gray-900 text-base sm:text-lg tracking-tight truncate">
                                            {certificateData.recipient.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 font-medium truncate">
                                            <FiMail className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                                            <span className="truncate">{certificateData.recipient.email}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Event Card */}
                            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <FiAward className="w-4 h-4 text-secondary" />
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-secondary">
                                            Kegiatan / Event
                                        </h3>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                        Terlaksana
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 text-sm sm:text-base tracking-tight line-clamp-1">
                                        {certificateData.event.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium pt-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <FiCalendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span suppressHydrationWarning>{formatDate(certificateData.event.start_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 truncate">
                                            <FiMapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="truncate">{certificateData.event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Canvas Preview (Fills remaining height smoothly without page scroll) */}
                        <div className="flex-1 min-h-[380px] lg:min-h-0 h-full overflow-hidden">
                            <CertificatePreview data={certificateData} />
                        </div>
                    </div>

                    {/* Right Sidebar: Status, Certificate Info, Signers, Download (SCROLLABLE ON DESKTOP) */}
                    <div className="lg:col-span-5 xl:col-span-4 h-full lg:overflow-y-auto lg:pr-1 custom-scrollbar order-2">
                        <CertificateSidebar data={certificateData} />
                    </div>

                </div>
            </main>
        </div>
    )
}
