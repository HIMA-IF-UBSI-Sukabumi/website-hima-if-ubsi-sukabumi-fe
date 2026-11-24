'use client'

import { useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useAxios from "@/core/hooks/use-axios";
import { electionsService } from "@/modules/elections/services/api/elections.service";
import ElectionResultsSection from "@/modules/elections/components/ElectionResultsSection";
import { formatDate } from "@/lib/utils";
import {
    FiAlertCircle,
    FiArrowLeft,
    FiBarChart2,
    FiCalendar,
    FiFastForward,
    FiLock,
    FiPlay,
    FiRefreshCw,
    FiUsers,
} from "react-icons/fi";

gsap.registerPlugin(useGSAP);

type RevealStage = "curtain" | "countdown" | "revealed";

interface ModuleElectionResultsPageProps {
    slug: string;
}

const COUNTDOWN_STEPS = [
    { count: 3, label: "Mengumpulkan kotak suara terenkripsi..." },
    { count: 2, label: "Memverifikasi total suara sah..." },
    { count: 1, label: "Membuka tabulasi hasil resmi..." },
];

const ModuleElectionResultsPage = ({ slug }: ModuleElectionResultsPageProps) => {
    const publicAxios = useAxios();
    const [stage, setStage] = useState<RevealStage>("curtain");
    const [countdownIndex, setCountdownIndex] = useState(0);
    const [replayKey, setReplayKey] = useState(0);

    const curtainRef = useRef<HTMLDivElement>(null);
    const countdownRef = useRef<HTMLDivElement>(null);

    const resultsQuery = useQuery({
        queryKey: ["election-results", slug],
        queryFn: () => electionsService.findResults(publicAxios, slug),
        retry: false,
    });

    useGSAP(
        () => {
            if (stage !== "curtain" || !curtainRef.current) return;

            gsap.from(curtainRef.current, {
                opacity: 0,
                y: 24,
                duration: 0.6,
                ease: "power3.out",
            });
        },
        { scope: curtainRef, dependencies: [stage] }
    );

    useGSAP(
        () => {
            if (stage !== "countdown" || !countdownRef.current) return;

            const tl = gsap.timeline({
                onComplete: () => {
                    setStage("revealed");
                },
            });

            COUNTDOWN_STEPS.forEach((_, idx) => {
                tl.call(() => setCountdownIndex(idx))
                    .fromTo(
                        ".countdown-number",
                        { scale: 0.5, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                    )
                    .to(".countdown-number", {
                        scale: 1.15,
                        opacity: 0,
                        duration: 0.35,
                        delay: 0.45,
                        ease: "power2.in",
                    });
            });
        },
        { scope: countdownRef, dependencies: [stage, replayKey] }
    );

    const handleStartReveal = () => {
        setCountdownIndex(0);
        setStage("countdown");
    };

    const handleReplay = () => {
        setReplayKey((prev) => prev + 1);
        setCountdownIndex(0);
        setStage("countdown");
    };

    if (resultsQuery.isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <div className="h-10 w-44 rounded-xl bg-gray-200/70 animate-pulse" />
                <div className="h-80 rounded-3xl bg-gray-200/70 animate-pulse" />
            </div>
        );
    }

    if (resultsQuery.isError || !resultsQuery.data) {
        const axiosError = resultsQuery.error as AxiosError<{ message?: string }> | null;
        const statusCode = axiosError?.response?.status;
        const isForbidden = statusCode === 403;

        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
                {isForbidden ? (
                    <FiLock className="w-12 h-12 text-amber-500 mx-auto" />
                ) : (
                    <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                )}
                <h1 className="text-xl font-bold text-gray-900">
                    {isForbidden
                        ? "Hasil Pemilu Belum Dipublikasikan"
                        : "Hasil Pemilu Tidak Ditemukan"}
                </h1>
                <p className="text-sm text-gray-600">
                    {isForbidden
                        ? axiosError?.response?.data?.message ||
                          "Hasil perolehan suara akan tersedia setelah jadwal publikasi dibuka."
                        : "Pemilu yang Anda cari tidak tersedia atau sudah dihapus."}
                </p>
                <div className="pt-2">
                    <Link
                        href={`/${slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Kembali ke Detail Pemilu
                    </Link>
                </div>
            </div>
        );
    }

    const { election, total_votes } = resultsQuery.data;
    const currentStep = COUNTDOWN_STEPS[countdownIndex] ?? COUNTDOWN_STEPS[0];

    return (
        <div
            className={`${
                stage === "revealed" ? "max-w-7xl" : "max-w-5xl"
            } mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 transition-all`}
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={`/${slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-primary transition"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Kembali ke Detail Pemilu
                </Link>

                {stage === "revealed" && (
                    <button
                        type="button"
                        onClick={handleReplay}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:border-primary/40 hover:text-primary transition cursor-pointer"
                    >
                        <FiRefreshCw className="w-3.5 h-3.5" />
                        Putar Ulang Animasi
                    </button>
                )}
            </div>

            {stage === "curtain" && (
                <div
                    ref={curtainRef}
                    className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 sm:p-12 text-center shadow-md space-y-6"
                >
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/15">
                        <FiBarChart2 className="w-4 h-4" />
                        Hasil Resmi Pemilu
                    </div>

                    <div className="space-y-2 max-w-2xl mx-auto">
                        <h1 className="font-archivo text-2xl sm:text-4xl leading-tight">
                            {election.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-white/80 pt-1">
                            <span className="inline-flex items-center gap-1.5">
                                <FiCalendar className="w-4 h-4" />
                                {formatDate(election.starts_at)} – {formatDate(election.ends_at)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <FiUsers className="w-4 h-4" />
                                <strong>{total_votes}</strong> Total Suara Masuk
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-white/80 max-w-lg mx-auto">
                        Tabulasi suara telah siap ditampilkan. Klik tombol di bawah ini untuk
                        membuka hasil perolehan suara masing-masing kandidat.
                    </p>

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={handleStartReveal}
                            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-primary text-sm sm:text-base font-bold shadow-sm hover:bg-gray-100 active:scale-[0.98] transition cursor-pointer"
                        >
                            <FiPlay className="w-4 h-4 fill-current" />
                            Buka Hasil Pemilu
                        </button>
                    </div>
                </div>
            )}

            {stage === "countdown" && (
                <div
                    ref={countdownRef}
                    className="rounded-3xl bg-primary text-white p-10 sm:p-16 text-center shadow-md space-y-6"
                >
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                        {election.title}
                    </p>

                    <div className="py-4">
                        <div className="countdown-number font-archivo text-7xl sm:text-8xl leading-none">
                            {currentStep.count}
                        </div>
                    </div>

                    <p className="text-sm sm:text-base font-medium text-white/90">
                        {currentStep.label}
                    </p>

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setStage("revealed")}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition cursor-pointer"
                        >
                            <FiFastForward className="w-3.5 h-3.5" />
                            Lewati Animasi
                        </button>
                    </div>
                </div>
            )}

            {stage === "revealed" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Main Column: Podium & Tabulation */}
                    <div className="lg:col-span-8 xl:col-span-9 min-w-0">
                        <ElectionResultsSection
                            data={resultsQuery.data}
                            animate
                            replayKey={replayKey}
                        />
                    </div>

                    {/* Sticky Sidebar: Election Details */}
                    <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 space-y-4">
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
                            <span
                                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                                    election.status === "active"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {election.status === "active"
                                    ? "Pemilu Berlangsung"
                                    : "Pemilu Selesai"}
                            </span>

                            <h1 className="font-archivo text-xl sm:text-2xl text-gray-900 leading-snug">
                                {election.title}
                            </h1>

                            {election.description && (
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    {election.description}
                                </p>
                            )}

                            <div className="pt-3 border-t border-gray-100 space-y-2.5 text-xs text-gray-500">
                                <div className="flex items-start gap-2">
                                    <FiCalendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    <span>
                                        {formatDate(election.starts_at)} – {formatDate(election.ends_at)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiUsers className="w-4 h-4 text-primary shrink-0" />
                                    <span>
                                        <strong className="text-gray-800">{total_votes}</strong> Total Suara Masuk
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default ModuleElectionResultsPage;
