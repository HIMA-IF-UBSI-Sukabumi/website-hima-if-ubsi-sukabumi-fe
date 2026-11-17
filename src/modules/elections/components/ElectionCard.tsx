'use client'

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ElectionSummary, VoterStatus } from "@/modules/elections/services/api/elections.service";
import { FiCalendar, FiUsers, FiCheckCircle, FiArrowRight, FiBarChart2 } from "react-icons/fi";

interface ElectionCardProps {
    election: ElectionSummary;
    voterStatus?: VoterStatus;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    active: {
        label: "Berlangsung",
        className: "bg-emerald-100 text-emerald-700",
    },
    closed: {
        label: "Selesai",
        className: "bg-gray-100 text-gray-600",
    },
    draft: {
        label: "Draft",
        className: "bg-amber-100 text-amber-700",
    },
};

const ElectionCard = ({ election, voterStatus }: ElectionCardProps) => {
    const badge = STATUS_BADGE[election.status] ?? STATUS_BADGE.closed;

    return (
        <Link
            href={`/${election.slug}`}
            className="group flex flex-col justify-between bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md hover:border-primary/30:border-indigo-500/40 transition-all duration-200"
        >
            <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.className}`}
                    >
                        {election.status === "active" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        {badge.label}
                    </span>

                    {voterStatus && (
                        <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                voterStatus.has_voted
                                    ? "bg-indigo-50 text-primary"
                                    : voterStatus.can_vote
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {voterStatus.has_voted ? (
                                <>
                                    <FiCheckCircle className="w-3.5 h-3.5" />
                                    Sudah Memilih
                                </>
                            ) : voterStatus.can_vote ? (
                                "Belum Memilih"
                            ) : (
                                "Tidak Dapat Memilih"
                            )}
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary:text-indigo-400 transition line-clamp-2 mb-2">
                    {election.title}
                </h3>

                {election.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                        {election.description}
                    </p>
                )}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiCalendar className="w-3.5 h-3.5 shrink-0 text-primary/70" />
                    <span className="truncate">
                        {formatDate(election.starts_at)} – {formatDate(election.ends_at)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1.5">
                            <FiUsers className="w-3.5 h-3.5 text-primary/70" />
                            {election.candidates_count} Paslon
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <FiBarChart2 className="w-3.5 h-3.5 text-primary/70" />
                            {election.participations_count} Suara
                        </span>
                    </div>

                    <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition">
                        Detail
                        <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ElectionCard;
