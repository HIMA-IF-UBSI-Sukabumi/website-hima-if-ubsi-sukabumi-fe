'use client'

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { resolveImageUrl } from "@/lib/utils";
import type { ElectionResultsResponse } from "@/modules/elections/services/api/elections.service";
import { FiBarChart2, FiAward } from "react-icons/fi";

gsap.registerPlugin(useGSAP);

interface ElectionResultsSectionProps {
    data: ElectionResultsResponse;
    animate?: boolean;
    replayKey?: number;
}

const ElectionResultsSection = ({
    data,
    animate = false,
    replayKey = 0,
}: ElectionResultsSectionProps) => {
    const containerRef = useRef<HTMLElement>(null);

    const sortedResults = [...data.results].sort((a, b) => b.votes - a.votes);
    const maxVotes = sortedResults[0]?.votes ?? 0;

    useGSAP(
        () => {
            if (!animate || !containerRef.current) return;

            const cards = gsap.utils.toArray<HTMLElement>(".result-card", containerRef.current);
            const bars = gsap.utils.toArray<HTMLElement>(".result-bar", containerRef.current);
            const voteEls = gsap.utils.toArray<HTMLElement>(".result-votes", containerRef.current);
            const pctEls = gsap.utils.toArray<HTMLElement>(".result-pct", containerRef.current);
            const leaderBadges = gsap.utils.toArray<HTMLElement>(".leader-badge", containerRef.current);

            if (cards.length > 0) {
                gsap.from(cards, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
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
        },
        {
            scope: containerRef,
            dependencies: [animate, replayKey, data.total_votes],
            revertOnUpdate: true,
        }
    );

    return (
        <section
            ref={containerRef}
            className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs"
        >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <FiBarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Hasil Perolehan Suara
                        </h2>
                        <p className="text-xs text-gray-500">
                            Total suara masuk: <strong>{data.total_votes}</strong> suara
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {sortedResults.map((item) => {
                    const percentage =
                        data.total_votes > 0
                            ? Math.round((item.votes / data.total_votes) * 1000) / 10
                            : 0;
                    const isLeader = maxVotes > 0 && item.votes === maxVotes;
                    const photoUrl = resolveImageUrl(item.photo);

                    return (
                        <div
                            key={item.candidate_id}
                            className={`result-card p-4 rounded-xl border ${
                                isLeader
                                    ? "border-primary/40 bg-primary/5"
                                    : "border-gray-100 bg-gray-50/50"
                            }`}
                        >
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-primary text-white font-archivo text-sm flex items-center justify-center shrink-0">
                                            {item.number}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-primary">
                                                #{item.number}
                                            </span>
                                            <h3 className="text-sm font-bold text-gray-900 truncate">
                                                {item.name}
                                            </h3>
                                            {isLeader && (
                                                <span className="leader-badge inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">
                                                    <FiAward className="w-3.5 h-3.5" />
                                                    Unggul
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <span
                                        data-target-pct={percentage}
                                        className="result-pct text-sm font-extrabold text-gray-900"
                                    >
                                        {animate ? "0%" : `${percentage}%`}
                                    </span>
                                    <p
                                        data-target-votes={item.votes}
                                        className="result-votes text-[11px] text-gray-500"
                                    >
                                        {animate ? "0 suara" : `${item.votes} suara`}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
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
        </section>
    );
};

export default ElectionResultsSection;
