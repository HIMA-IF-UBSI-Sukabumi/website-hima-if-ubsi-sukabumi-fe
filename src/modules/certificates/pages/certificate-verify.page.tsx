'use client'

import { useQuery } from '@tanstack/react-query'
import useAxios from '@/core/hooks/use-axios'
import {
    certificateService,
    CertificateData,
    MOCK_CERTIFICATE_DATA
} from '../services/api/certificate.service'
import { CertificateNavbar } from '../components/CertificateNavbar'
import { CertificateSidebar } from '../components/CertificateSidebar'
import { CertificatePreview } from '../components/CertificatePreview'
import Link from 'next/link'
import { FiArrowLeft, FiAlertTriangle, FiSearch } from 'react-icons/fi'

interface ModuleCertificateVerifyPageProps {
    code: string
}

export default function ModuleCertificateVerifyPage({ code }: ModuleCertificateVerifyPageProps) {
    const axios = useAxios()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['certificate-verify', code],
        queryFn: async () => {
            try {
                const res = await certificateService.verifyByCode(axios, code)
                if (res && res.success && res.data) {
                    return res.data
                }
                throw new Error(res?.message || 'Sertifikat tidak valid')
            } catch (err) {
                // If code matches mock code or for demo purposes when backend unavailable:
                if (code === MOCK_CERTIFICATE_DATA.short_code || code === 'demo' || code === MOCK_CERTIFICATE_DATA.id) {
                    return MOCK_CERTIFICATE_DATA
                }
                throw err
            }
        },
        retry: 1,
        staleTime: 5 * 60 * 1000,
    })

    // Fallback data for demo testing if query fails or returns mock
    const certificateData: CertificateData | undefined = data || (code === MOCK_CERTIFICATE_DATA.short_code ? MOCK_CERTIFICATE_DATA : undefined)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
                <CertificateNavbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Preview Skeleton */}
                        <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
                            <div className="w-full h-[500px] lg:h-[640px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                        </div>
                        {/* Sidebar Skeleton */}
                        <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1 space-y-4">
                            <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                            <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                            <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (isError && !certificateData) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
                <CertificateNavbar />
                <main className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                        <FiAlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Sertifikat Tidak Ditemukan
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                            Kode sertifikat <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-rose-500">{code}</code> tidak terdaftar atau telah dicabut.
                        </p>
                    </div>
                    <div className="pt-4 flex items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition shadow-md"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    if (!certificateData) return null

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            <CertificateNavbar
                certificateNumber={certificateData.certificate_number}
                isValid={certificateData.is_valid}
                verificationUrl={certificateData.verification_url}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Content: Certificate Canvas Preview */}
                    <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
                        <CertificatePreview data={certificateData} />
                    </div>

                    {/* Sidebar: Details, Recipient, Event, Signers & Actions */}
                    <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1 lg:sticky lg:top-20">
                        <CertificateSidebar data={certificateData} />
                    </div>
                </div>
            </main>
        </div>
    )
}
