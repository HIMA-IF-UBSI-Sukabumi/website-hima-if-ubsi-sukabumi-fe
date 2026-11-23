'use client'

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import { talentService } from "@/modules/talents/services/api/talent.service";
import TalentHeroCard from "@/modules/talents/components/TalentHeroCard";
import TalentSidebar from "@/modules/talents/components/TalentSidebar";
import TalentProjectsSection from "@/modules/talents/components/TalentProjectsSection";
import TalentAchievementsSection from "@/modules/talents/components/TalentAchievementsSection";
import TalentCertificatesSection from "@/modules/talents/components/TalentCertificatesSection";
import TalentCommitteesSection from "@/modules/talents/components/TalentCommitteesSection";
import { FiAlertCircle, FiArrowLeft, FiRefreshCw } from "react-icons/fi";

interface ModuleTalentsDetailPageProps {
    identifier: string;
}

const ModuleTalentsDetailPage = ({
    identifier,
}: ModuleTalentsDetailPageProps) => {
    const router = useRouter();
    const publicAxios = useAxios();

    const talentQuery = useQuery({
        queryKey: ["talent-profile", identifier],
        queryFn: () => talentService.findByIdentifier(publicAxios, identifier),
        retry: false,
    });

    const data = talentQuery.data;

    useEffect(() => {
        if (data?.profile?.profile_slug && data.profile.profile_slug !== identifier) {
            router.replace(`/p/${data.profile.profile_slug}`);
        }
    }, [data?.profile?.profile_slug, identifier, router]);

    if (talentQuery.isLoading) {
        return (
            <div
                aria-busy="true"
                aria-label="Memuat profil talent"
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8"
            >
                <div className="h-64 rounded-2xl bg-gray-200/80 animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-4">
                        <div className="h-44 rounded-2xl bg-gray-200/80 animate-pulse" />
                        <div className="h-52 rounded-2xl bg-gray-200/80 animate-pulse" />
                    </div>
                    <div className="lg:col-span-8 space-y-5">
                        <div className="h-56 rounded-2xl bg-gray-200/80 animate-pulse" />
                        <div className="h-40 rounded-2xl bg-gray-200/80 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (talentQuery.isError || !data) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200/70">
                    <FiAlertCircle className="w-7 h-7" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                    <h1 className="font-archivo text-2xl text-gray-900">
                        Profil Talent Tidak Ditemukan
                    </h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Profil mahasiswa dengan pengenal{" "}
                        <span className="font-mono font-semibold text-gray-800">
                            {identifier}
                        </span>{" "}
                        tidak tersedia, belum dipublikasikan, atau sedang mengalami gangguan koneksi.
                    </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => talentQuery.refetch()}
                        className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        <FiRefreshCw className="w-4 h-4" aria-hidden="true" />
                        <span>Coba Lagi</span>
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        <FiArrowLeft className="w-4 h-4" aria-hidden="true" />
                        <span>Kembali ke Portal Utama</span>
                    </Link>
                </div>
            </div>
        );
    }

    const { profile, organization_history, projects, achievements, certificates, committees } =
        data;

    const activeOrg = organization_history.find((org) => org.is_active);
    const hasSidebarInfo = Boolean(
        profile.bio || profile.skills.length > 0 || organization_history.length > 0
    );
    const hasMainContent =
        projects.length > 0 ||
        achievements.length > 0 ||
        certificates.length > 0 ||
        committees.length > 0;

    const sectionAnchors = [
        projects.length > 0 ? { id: "proyek", label: `Proyek (${projects.length})` } : null,
        achievements.length > 0
            ? { id: "prestasi", label: `Prestasi (${achievements.length})` }
            : null,
        certificates.length > 0
            ? { id: "sertifikat", label: `Sertifikat (${certificates.length})` }
            : null,
        committees.length > 0
            ? { id: "kepanitiaan", label: `Kepanitiaan (${committees.length})` }
            : null,
    ].filter((item): item is { id: string; label: string } => item !== null);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
            <TalentHeroCard
                profile={profile}
                activeOrg={activeOrg}
                sectionAnchors={sectionAnchors}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {hasSidebarInfo && (
                    <TalentSidebar
                        profile={profile}
                        organizationHistory={organization_history}
                        counts={{
                            projects: projects.length,
                            achievements: achievements.length,
                            certificates: certificates.length,
                            committees: committees.length,
                        }}
                        hasMainContent={hasMainContent}
                    />
                )}

                <div
                    className={
                        hasSidebarInfo
                            ? "lg:col-span-8 space-y-10 min-w-0"
                            : "lg:col-span-12 space-y-10 min-w-0"
                    }
          >
                    <TalentAchievementsSection achievements={achievements} />
                    <TalentProjectsSection projects={projects} />
                    <TalentCertificatesSection certificates={certificates} />
                    <TalentCommitteesSection committees={committees} />

                    {!hasMainContent && (
                        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center space-y-2">
                            <p className="text-sm font-semibold text-gray-800">
                                Portofolio Belum Dipublikasikan
                            </p>
                            <p className="text-xs text-gray-500">
                                Belum ada proyek, prestasi, sertifikat, atau riwayat kepanitiaan yang
                                ditampilkan pada profil ini.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModuleTalentsDetailPage;
