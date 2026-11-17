'use client'

import { resolveImageUrl } from "@/lib/utils";
import type { ElectionResultsResponse } from "@/modules/elections/services/api/elections.service";
import { FiBarChart2, FiAward } from "react-icons/fi";

interface ElectionResultsSectionProps {
    data: ElectionResultsResponse;
}

const ElectionResultsSection = ({ data }: ElectionResultsSectionProps) => {
    const sortedResults = [...data.results].sort((a, b) => b.votes - a.votes);
    const maxVotes = sortedResults[0]?.votes ?? 0;

    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
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
                            className={`p-4 rounded-xl border ${
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
                                                <FiAward className="w-4 h-4 text-amber-500 shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="text-sm font-extrabold text-gray-900">
                                        {percentage}%
                                    </span>
                                    <p className="text-[11px] text-gray-500">
                                        {item.votes} suara
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
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
