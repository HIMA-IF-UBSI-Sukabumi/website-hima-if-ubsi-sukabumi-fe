'use client'

import { useState } from "react";
import { resolveImageUrl } from "@/lib/utils";
import type { Candidate } from "@/modules/elections/services/api/elections.service";
import { FiCheckCircle, FiFileText, FiChevronDown, FiChevronUp, FiUser } from "react-icons/fi";

interface CandidateCardProps {
    candidate: Candidate;
    canVote: boolean;
    hasVoted: boolean;
    onSelectVote: (candidate: Candidate) => void;
}

const CandidateCard = ({
    candidate,
    canVote,
    hasVoted,
    onSelectVote,
}: CandidateCardProps) => {
    const [showVision, setShowVision] = useState(false);
    const imageSrc = resolveImageUrl(candidate.photo_url || candidate.photo);

    return (
        <div className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
            {/* Photo header */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FiUser className="w-16 h-16" />
                    </div>
                )}

                <div className="absolute top-3 left-3 flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-archivo text-lg shadow-md">
                    {candidate.number}
                </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-secondary mb-1">
                        Paslon Nomor Urut {candidate.number}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900">
                        {candidate.name}
                    </h3>

                    {candidate.vision_mission && (
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => setShowVision((prev) => !prev)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                            >
                                <FiFileText className="w-3.5 h-3.5" />
                                <span>{showVision ? "Sembunyikan Visi & Misi" : "Lihat Visi & Misi"}</span>
                                {showVision ? (
                                    <FiChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                    <FiChevronDown className="w-3.5 h-3.5" />
                                )}
                            </button>

                            {showVision && (
                                <div
                                    className="mt-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100 prose prose-sm max-w-none text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: candidate.vision_mission }}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="pt-3 border-t border-gray-100">
                    {hasVoted ? (
                        <div className="w-full py-2.5 px-4 rounded-xl bg-gray-100 text-gray-500 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                            <FiCheckCircle className="w-4 h-4" />
                            Suara Sudah Direkam
                        </div>
                    ) : (
                        <button
                            type="button"
                            disabled={!canVote}
                            onClick={() => onSelectVote(candidate)}
                            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 disabled:bg-gray-200:bg-zinc-800 disabled:text-gray-400:text-zinc-500 disabled:cursor-not-allowed transition cursor-pointer shadow-xs"
                        >
                            {canVote ? `Pilih Paslon #${candidate.number}` : "Voting Tidak Tersedia"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateCard;
