'use client'

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";
import { resolveImageUrl } from "@/lib/utils";
import type {
    ElectionResultItem,
    ElectionResultsResponse,
} from "@/modules/elections/services/api/elections.service";
import { FiBarChart2, FiAward } from "react-icons/fi";

gsap.registerPlugin(useGSAP);

interface ElectionResultsSectionProps {
    data: ElectionResultsResponse;
    animate?: boolean;
    replayKey?: number;
}

const CELEBRATION_COLORS = ["#2C2F91", "#4F46E5", "#F59E0B", "#10B981", "#EC4899"];

interface PodiumStyle {
    rank: number;
    label: string;
    orderClass: string;
    pedestalHeightClass: string;
    pedestalBgClass: string;
    badgeClass: string;
    avatarSizeClass: string;
    ringClass: string;
}

const PODIUM_STYLES: Record<number, PodiumStyle> = {
    1: {
        rank: 1,
        label: "Unggul #1",
        orderClass: "order-1 sm:order-2",
        pedestalHeightClass: "h-24 sm:h-40",
        pedestalBgClass: "bg-gradient-to-b from-primary via-[#3b3fa8] to-indigo-700 text-white",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
        avatarSizeClass: "w-24 h-24 sm:w-32 sm:h-32",
        ringClass: "ring-4 ring-amber-400/80",
    },
    2: {
        rank: 2,
        label: "Peringkat #2",
        orderClass: "order-2 sm:order-1",
        pedestalHeightClass: "h-20 sm:h-28",
        pedestalBgClass: "bg-gradient-to-b from-slate-600 to-slate-700 text-white",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
        avatarSizeClass: "w-20 h-20 sm:w-24 sm:h-24",
        ringClass: "ring-4 ring-slate-300",
    },
    3: {
        rank: 3,
        label: "Peringkat #3",
        orderClass: "order-3 sm:order-3",
        pedestalHeightClass: "h-16 sm:h-20",
        pedestalBgClass: "bg-gradient-to-b from-amber-700 to-amber-800 text-white",
        badgeClass: "bg-orange-50 text-orange-800 border-orange-200",
        avatarSizeClass: "w-20 h-20 sm:w-24 sm:h-24",
        ringClass: "ring-4 ring-amber-600/50",
    },
};

function getPercentage(votes: number, totalVotes: number): number {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 1000) / 10 : 0;
}

const ElectionResultsSection = ({
    data,
    animate = false,
    replayKey = 0,
}: ElectionResultsSectionProps) => {
    const containerRef = useRef<HTMLElement>(null);

    const sortedResults = [...data.results].sort((a, b) => b.votes - a.votes);
    const maxVotes = sortedResults[0]?.votes ?? 0;
    const podiumCandidates = sortedResults.slice(0, 3);

    useGSAP(
        () => {
            if (!animate || !containerRef.current) return;

            const podiumCards = gsap.utils.toArray<HTMLElement>(".podium-item", containerRef.current);
            const pedestals = gsap.utils.toArray<HTMLElement>(".podium-pedestal", containerRef.current);
            const cards = gsap.utils.toArray<HTMLElement>(".result-card", containerRef.current);
            const bars = gsap.utils.toArray<HTMLElement>(".result-bar", containerRef.current);
            const voteEls = gsap.utils.toArray<HTMLElement>(".result-votes", containerRef.current);
            const pctEls = gsap.utils.toArray<HTMLElement>(".result-pct", containerRef.current);
            const leaderBadges = gsap.utils.toArray<HTMLElement>(".leader-badge", containerRef.current);

            if (pedestals.length > 0) {
                gsap.from(pedestals, {
                    scaleY: 0,
                    transformOrigin: "bottom center",
                    duration: 0.9,
                    delay: 0.2,
                    stagger: 0.12,
                    ease: "power3.out",
                });
            }

            if (podiumCards.length > 0) {
                gsap.from(podiumCards, {
                    opacity: 0,
                    y: 28,
                    duration: 0.7,
                    delay: 0.15,
                    stagger: 0.12,
                    ease: "power3.out",
                });
            }

            if (cards.length > 0) {
                gsap.from(cards, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out",
                });
            }

            bars.forEach((bar) => {
                const targetWidth = bar.dataset.targetWidth ?? "0%";
                gsap.fromTo(
                    bar,
                    { width: "0%" },
                    {
                        width: targetWidth,
                        duration: 2.2,
                        delay: 0.25,
                        ease: "power2.out",
                    }
                );
            });

            voteEls.forEach((el) => {
                const target = Number(el.dataset.targetVotes ?? 0);
                const counter = { value: 0 };
                gsap.to(counter, {
                    value: target,
                    duration: 2.2,
                    delay: 0.25,
                    ease: "power2.out",
                    onUpdate: () => {
                        el.textContent = `${Math.round(counter.value)} suara`;
                    },
                });
            });

            pctEls.forEach((el) => {
                const target = Number(el.dataset.targetPct ?? 0);
                const counter = { value: 0 };
                gsap.to(counter, {
                    value: target,
                    duration: 2.2,
                    delay: 0.25,
                    ease: "power2.out",
                    onUpdate: () => {
                        const rounded = Math.round(counter.value * 10) / 10;
                        el.textContent = `${rounded}%`;
                    },
                });
            });

            if (leaderBadges.length > 0) {
                gsap.from(leaderBadges, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    delay: 2.1,
                    ease: "back.out(1.8)",
                });
            }

            let fireworksTimer: ReturnType<typeof setInterval> | null = null;
            const delayedBurst = gsap.delayedCall(2.1, () => {
                confetti({
                    particleCount: 70,
                    angle: 60,
                    spread: 65,
                    origin: { x: 0, y: 0.65 },
                    colors: CELEBRATION_COLORS,
                });
                confetti({
                    particleCount: 70,
                    angle: 120,
                    spread: 65,
                    origin: { x: 1, y: 0.65 },
                    colors: CELEBRATION_COLORS,
                });

                const endAt = Date.now() + 5000;
                fireworksTimer = setInterval(() => {
                    const timeLeft = endAt - Date.now();
                    if (timeLeft <= 0) {
                        if (fireworksTimer) clearInterval(fireworksTimer);
                        fireworksTimer = null;
                        return;
                    }

                    const particleCount = Math.max(20, Math.round(50 * (timeLeft / 2400)));
                    confetti({
                        particleCount,
                        startVelocity: 30,
                        spread: 360,
                        ticks: 60,
                        zIndex: 60,
                        colors: CELEBRATION_COLORS,
                        origin: {
                            x: 0.15 + Math.random() * 0.3,
                            y: Math.random() * 0.35 + 0.1,
                        },
                    });
                    confetti({
                        particleCount,
                        startVelocity: 30,
                        spread: 360,
                        ticks: 60,
                        zIndex: 60,
                        colors: CELEBRATION_COLORS,
                        origin: {
                            x: 0.55 + Math.random() * 0.3,
                            y: Math.random() * 0.35 + 0.1,
                        },
                    });
                }, 320);
            });

            return () => {
                delayedBurst.kill();
                if (fireworksTimer) clearInterval(fireworksTimer);
                confetti.reset();
            };
        },
        {
            scope: containerRef,
            dependencies: [animate, replayKey, data.total_votes],
            revertOnUpdate: true,
        }
    );

    const renderPodiumItem = (item: ElectionResultItem, index: number) => {
        const rank = index + 1;
        const style = PODIUM_STYLES[rank] ?? PODIUM_STYLES[3];
        const percentage = getPercentage(item.votes, data.total_votes);
        const photoUrl = resolveImageUrl(item.photo);
        const isFirst = rank === 1 && maxVotes > 0;

        return (
            <div
                key={item.candidate_id}
                className={`podium-item flex flex-col items-center w-full sm:w-64 ${style.orderClass}`}
            >
                {/* Candidate Info Above Pedestal */}
                <div className="flex flex-col items-center text-center px-3 pb-4 space-y-2.5 w-full">
                    <div className="relative">
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt={item.name}
                                className={`${style.avatarSizeClass} rounded-2xl object-cover border-4 border-white shadow-md ${style.ringClass}`}
                            />
                        ) : (
                            <div
                                className={`${style.avatarSizeClass} rounded-2xl bg-primary text-white font-archivo text-2xl sm:text-3xl flex items-center justify-center border-4 border-white shadow-md ${style.ringClass}`}
                            >
                                {item.number}
                            </div>
                        )}
                        <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-white font-archivo text-xs flex items-center justify-center border-2 border-white shadow-sm">
                            #{item.number}
                        </span>
                    </div>

                    <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isFirst ? "leader-badge " : ""
                        }${style.badgeClass}`}
                    >
                        {isFirst && <FiAward className="w-3.5 h-3.5" />}
                        {style.label}
                    </span>

                    <h3
                        className={`font-bold text-gray-900 leading-snug line-clamp-2 ${
                            isFirst ? "text-base sm:text-lg" : "text-sm sm:text-base"
                        }`}
                    >
                        {item.name}
                    </h3>

                    <div className="space-y-0.5">
                        <p
                            data-target-pct={percentage}
                            className={`result-pct font-archivo ${
                                isFirst
                                    ? "text-2xl sm:text-3xl text-primary"
                                    : "text-xl sm:text-2xl text-gray-800"
                            }`}
                        >
                            {animate ? "0%" : `${percentage}%`}
                        </p>
                        <p
                            data-target-votes={item.votes}
                            className="result-votes text-xs font-medium text-gray-500"
                        >
                            {animate ? "0 suara" : `${item.votes} suara`}
                        </p>
                    </div>
                </div>

                {/* Podium Pedestal */}
                <div
                    className={`podium-pedestal w-full ${style.pedestalHeightClass} ${style.pedestalBgClass} rounded-2xl sm:rounded-b-none sm:rounded-t-2xl shadow-md flex flex-col items-center justify-center relative overflow-hidden`}
                >
                    <span className="font-archivo text-4xl sm:text-5xl opacity-90 drop-shadow-xs">
                        {rank}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-75">
                        {rank === 1 ? "Pemenang" : `Posisi ${rank}`}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <section ref={containerRef} className="space-y-6">
            {/* Podium Stage */}
            {podiumCandidates.length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 sm:pb-0 shadow-xs overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <FiAward className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                    Podium Perolehan Suara
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Total suara masuk: <strong>{data.total_votes}</strong> suara
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-center gap-6 sm:gap-4 pt-2">
                        {podiumCandidates.map((item, idx) => renderPodiumItem(item, idx))}
                    </div>
                </div>
            )}

            {/* Full Tabulation Bars */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <FiBarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            Rincian Tabulasi Suara
                        </h3>
                        <p className="text-xs text-gray-500">
                            Persentase perolehan seluruh kandidat
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {sortedResults.map((item, idx) => {
                        const percentage = getPercentage(item.votes, data.total_votes);
                        const isLeader = maxVotes > 0 && item.votes === maxVotes;
                        const photoUrl = resolveImageUrl(item.photo);

                        return (
                            <div
                                key={item.candidate_id}
                                className={`result-card p-4 rounded-2xl border ${
                                    isLeader
                                        ? "border-primary/40 bg-primary/5"
                                        : "border-gray-100 bg-gray-50/60"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-3 mb-2.5">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {photoUrl ? (
                                            <img
                                                src={photoUrl}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-primary text-white font-archivo text-base flex items-center justify-center shrink-0">
                                                {item.number}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="text-xs font-bold text-primary">
                                                    #{item.number}
                                                </span>
                                                <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                                                    {item.name}
                                                </h4>
                                                {isLeader && (
                                                    <span className="leader-badge inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                                                        <FiAward className="w-3 h-3" />
                                                        Peringkat {idx + 1}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span
                                            data-target-pct={percentage}
                                            className="result-pct text-base sm:text-lg font-archivo text-gray-900"
                                        >
                                            {animate ? "0%" : `${percentage}%`}
                                        </span>
                                        <p
                                            data-target-votes={item.votes}
                                            className="result-votes text-xs text-gray-500"
                                        >
                                            {animate ? "0 suara" : `${item.votes} suara`}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        data-target-width={`${percentage}%`}
                                        className="result-bar h-full rounded-full bg-primary"
                                        style={{ width: animate ? "0%" : `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ElectionResultsSection;
