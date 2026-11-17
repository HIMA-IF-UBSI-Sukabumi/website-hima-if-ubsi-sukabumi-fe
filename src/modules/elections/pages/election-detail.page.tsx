'use client'

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import useAxios from "@/core/hooks/use-axios";
import { useAuthAxios } from "@/core/hooks/use-auth-axios";
import { useIsAuthenticated } from "@/core/stores/use-auth-store";
import {
    electionsService,
    VOTER_REASON_MESSAGES,
    type Candidate,
} from "@/modules/elections/services/api/elections.service";
import CandidateCard from "@/modules/elections/components/CandidateCard";
import VoteConfirmModal from "@/modules/elections/components/VoteConfirmModal";
import ElectionResultsSection from "@/modules/elections/components/ElectionResultsSection";
import { formatDate, getSsoLoginUrl } from "@/lib/utils";
import {
    FiArrowLeft,
    FiCalendar,
    FiCheckCircle,
    FiInfo,
    FiLogIn,
    FiUsers,
    FiAlertCircle,
} from "react-icons/fi";

interface ModuleElectionDetailPageProps {
    slug: string;
}

const ModuleElectionDetailPage = ({ slug }: ModuleElectionDetailPageProps) => {
    const publicAxios = useAxios();
    const authAxios = useAuthAxios();
    const queryClient = useQueryClient();

    const { isLoggedIn } = useIsAuthenticated();

    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [voteError, setVoteError] = useState<string | null>(null);
    const [voteSuccessMsg, setVoteSuccessMsg] = useState<string | null>(null);

    const detailQuery = useQuery({
        queryKey: ["election-detail", slug],
        queryFn: () => electionsService.findBySlug(publicAxios, slug),
    });

    const election = detailQuery.data?.election;

    const myStatusQuery = useQuery({
        queryKey: ["election-my-status", slug],
        queryFn: () => electionsService.findMyStatus(authAxios, slug),
        enabled: isLoggedIn && Boolean(election),
    });

    const resultsQuery = useQuery({
        queryKey: ["election-results", slug],
        queryFn: () => electionsService.findResults(publicAxios, slug),
        enabled: Boolean(election?.can_show_results),
    });

    const voteMutation = useMutation({
        mutationFn: (candidateId: string) =>
            electionsService.vote(authAxios, slug, { candidate_id: candidateId }),
        onSuccess: (res) => {
            setVoteSuccessMsg(res.message || "Suara berhasil direkam.");
            setSelectedCandidate(null);
            setVoteError(null);
            queryClient.invalidateQueries({ queryKey: ["election-my-status", slug] });
            queryClient.invalidateQueries({ queryKey: ["election-detail", slug] });
            queryClient.invalidateQueries({ queryKey: ["my-elections"] });
        },
        onError: (err: AxiosError<{ message?: string; has_voted?: boolean }>) => {
            const status = err.response?.status;
            const message =
                err.response?.data?.message || "Gagal mengirim suara. Silakan coba lagi.";

            if (status === 409) {
                setSelectedCandidate(null);
                setVoteError(null);
                setVoteSuccessMsg(message);
                queryClient.invalidateQueries({ queryKey: ["election-my-status", slug] });
                return;
            }

            setVoteError(message);
        },
    });

    if (detailQuery.isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <div className="h-44 rounded-3xl bg-gray-200/70 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-80 rounded-2xl bg-gray-200/70 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (detailQuery.isError || !election) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
                <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h1 className="text-xl font-bold text-gray-900">
                    Pemilu Tidak Ditemukan
                </h1>
                <p className="text-sm text-gray-600">
                    Pemilu yang Anda cari tidak tersedia, belum disetujui, atau sudah dihapus.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Pemilu
                </Link>
            </div>
        );
    }

    const voterStatus = myStatusQuery.data?.status;
    const canVote = Boolean(isLoggedIn && voterStatus?.can_vote);
    const hasVoted = Boolean(voterStatus?.has_voted);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-primary:text-indigo-400 transition"
            >
                <FiArrowLeft className="w-4 h-4" />
                Kembali ke Daftar Pemilu
            </Link>

            {/* Election Header */}
            <section className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                    <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                            election.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {election.status === "active" ? "Pemilu Berlangsung" : "Pemilu Selesai"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <FiUsers className="w-3.5 h-3.5" />
                        {election.participations_count} Partisipan
                    </span>
                </div>

                <h1 className="font-archivo text-2xl sm:text-3xl text-gray-900">
                    {election.title}
                </h1>

                {election.description && (
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
                        {election.description}
                    </p>
                )}

                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 pt-2">
                    <FiCalendar className="w-4 h-4 text-primary shrink-0" />
                    <span>
                        {formatDate(election.starts_at)} – {formatDate(election.ends_at)}
                    </span>
                </div>
            </section>

            {/* Voter Status Banner */}
            {voteSuccessMsg && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                    <FiCheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">{voteSuccessMsg}</p>
                    </div>
                </div>
            )}

            {!isLoggedIn ? (
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                        <FiInfo className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold text-gray-900">
                                Masuk untuk mengecek status pemilih dan memberikan suara
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                                Gunakan akun SSO mahasiswa HIMA-IF Anda.
                            </p>
                        </div>
                    </div>
                    <a
                        href={getSsoLoginUrl("elections")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary/90 transition"
                    >
                        <FiLogIn className="w-4 h-4" />
                        Masuk via SSO
                    </a>
                </div>
            ) : voterStatus ? (
                <div
                    className={`flex items-start gap-3 p-4 rounded-2xl border text-sm ${
                        voterStatus.has_voted
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : voterStatus.can_vote
                            ? "bg-indigo-50 border-indigo-200 text-indigo-900"
                            : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}
                >
                    {voterStatus.has_voted ? (
                        <FiCheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                        <FiInfo className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <div>
                        {voterStatus.can_vote ? (
                            <p className="font-semibold">
                                Anda terdaftar sebagai pemilih eligible. Silakan pilih salah satu paslon di bawah ini.
                            </p>
                        ) : voterStatus.reason ? (
                            <p className="font-semibold">
                                {VOTER_REASON_MESSAGES[voterStatus.reason]}
                            </p>
                        ) : (
                            <p className="font-semibold">Status pemilih sedang diperbarui.</p>
                        )}
                    </div>
                </div>
            ) : null}

            {/* Candidates Grid */}
            <section className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">
                    Daftar Kandidat ({election.candidates.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {election.candidates.map((candidate) => (
                        <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            canVote={canVote}
                            hasVoted={hasVoted}
                            onSelectVote={(c) => {
                                setVoteError(null);
                                setSelectedCandidate(c);
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* Results Section */}
            {election.can_show_results && resultsQuery.data && (
                <ElectionResultsSection data={resultsQuery.data} />
            )}

            <VoteConfirmModal
                isOpen={Boolean(selectedCandidate)}
                candidate={selectedCandidate}
                electionTitle={election.title}
                isSubmitting={voteMutation.isPending}
                errorMessage={voteError}
                onConfirm={() => {
                    if (selectedCandidate) {
                        voteMutation.mutate(selectedCandidate.id);
                    }
                }}
                onClose={() => {
                    if (!voteMutation.isPending) {
                        setSelectedCandidate(null);
                        setVoteError(null);
                    }
                }}
            />
        </div>
    );
};

export default ModuleElectionDetailPage;
