'use client'

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import {
    talentService,
    type TalentDetailResponse,
} from "@/modules/profile/services/api/talent.service";
import { formatDate, formatTimestamp, resolveImageUrl } from "@/lib/utils";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import {
    FiAlertCircle,
    FiArrowLeft,
    FiArrowUpRight,
    FiAward,
    FiBriefcase,
    FiCalendar,
    FiCheck,
    FiCheckCircle,
    FiExternalLink,
    FiFolder,
    FiRefreshCw,
    FiShare2,
    FiShield,
    FiUsers,
} from "react-icons/fi";

interface ModuleProfileTalentDetailPageProps {
    identifier: string;
    initialData?: TalentDetailResponse | null;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    aktif: {
        label: "Mahasiswa Aktif",
        className:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60",
    },
    alumni: {
        label: "Alumni",
        className:
            "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60",
    },
};

function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const ModuleProfileTalentDetailPage = ({
    identifier,
    initialData,
}: ModuleProfileTalentDetailPageProps) => {
    const publicAxios = useAxios();
    const [copied, setCopied] = useState(false);

    const talentQuery = useQuery({
        queryKey: ["talent-profile", identifier],
        queryFn: () => talentService.findByIdentifier(publicAxios, identifier),
        initialData: initialData ?? undefined,
        retry: false,
    });

    const data = talentQuery.data;

    const handleCopyLink = () => {
        if (typeof window === "undefined" || !navigator.clipboard) return;
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (talentQuery.isLoading) {
        return (
            <div
                aria-busy="true"
                aria-label="Memuat profil talent"
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8"
            >
                <div className="h-64 rounded-2xl bg-gray-200/80 dark:bg-slate-800/80 animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-4">
                        <div className="h-44 rounded-2xl bg-gray-200/80 dark:bg-slate-800/80 animate-pulse" />
                        <div className="h-52 rounded-2xl bg-gray-200/80 dark:bg-slate-800/80 animate-pulse" />
                    </div>
                    <div className="lg:col-span-8 space-y-5">
                        <div className="h-56 rounded-2xl bg-gray-200/80 dark:bg-slate-800/80 animate-pulse" />
                        <div className="h-40 rounded-2xl bg-gray-200/80 dark:bg-slate-800/80 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (talentQuery.isError || !data) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200/70 dark:border-red-900/60">
                    <FiAlertCircle className="w-7 h-7" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                    <h1 className="font-archivo text-2xl text-gray-900 dark:text-white">
                        Profil Talent Tidak Ditemukan
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                        Profil mahasiswa dengan pengenal{" "}
                        <span className="font-mono font-semibold text-gray-800 dark:text-slate-200">
                            {identifier}
                        </span>{" "}
                        tidak tersedia, belum dipublikasikan, atau sedang mengalami gangguan koneksi.
                    </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => talentQuery.refetch()}
                        className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
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
    const avatarUrl = resolveImageUrl(profile.avatar);
    const initials = profile.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const statusBadge = profile.status ? STATUS_BADGE[profile.status] : null;
    const activeOrg = organization_history.find((org) => org.is_active);
    const hasSocialLinks = Boolean(
        profile.social_links?.github ||
            profile.social_links?.linkedin ||
            profile.social_links?.instagram
    );
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
            {/* Identity Header */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="h-24 sm:h-32 bg-primary relative">
                    <div
                        className="absolute inset-x-0 bottom-0 h-1 bg-secondary"
                        aria-hidden="true"
                    />
                </div>

                <div className="px-5 sm:px-8 pb-7 -mt-12 sm:-mt-16 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={`Foto profil ${profile.name}`}
                                    width={120}
                                    height={120}
                                    fetchPriority="high"
                                    className="w-24 h-24 sm:w-30 sm:h-30 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-sm bg-white dark:bg-slate-800 shrink-0"
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="w-24 h-24 sm:w-30 sm:h-30 rounded-2xl border-4 border-white dark:border-slate-900 shadow-sm bg-primary text-white font-archivo text-2xl sm:text-3xl flex items-center justify-center shrink-0"
                                >
                                    {initials || "IF"}
                                </div>
                            )}

                            <div className="space-y-1.5 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    {statusBadge && (
                                        <span
                                            className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-md ${statusBadge.className}`}
                                        >
                                            {statusBadge.label}
                                        </span>
                                    )}
                                    <span className="text-xs font-mono font-medium text-gray-600 dark:text-slate-400">
                                        NIM {profile.nim}
                                    </span>
                                    {activeOrg && (
                                        <span className="text-xs font-medium text-primary dark:text-indigo-300">
                                            &bull;{" "}
                                            {[activeOrg.jabatan, activeOrg.departemen]
                                                .filter(Boolean)
                                                .join(" ")}
                                        </span>
                                    )}
                                </div>

                                <h1 className="font-archivo text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight break-words">
                                    {profile.name}
                                </h1>

                                {profile.headline && (
                                    <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-slate-300">
                                        {profile.headline}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {hasSocialLinks && (
                                <div className="flex items-center gap-1.5">
                                    {profile.social_links.github && (
                                        <a
                                            href={profile.social_links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`GitHub ${profile.name}`}
                                            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:border-primary hover:text-primary dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition focus-visible:outline-2 focus-visible:outline-primary"
                                        >
                                            <FaGithub className="w-4 h-4" aria-hidden="true" />
                                        </a>
                                    )}
                                    {profile.social_links.linkedin && (
                                        <a
                                            href={profile.social_links.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`LinkedIn ${profile.name}`}
                                            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:border-primary hover:text-primary dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition focus-visible:outline-2 focus-visible:outline-primary"
                                        >
                                            <FaLinkedin className="w-4 h-4" aria-hidden="true" />
                                        </a>
                                    )}
                                    {profile.social_links.instagram && (
                                        <a
                                            href={profile.social_links.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Instagram ${profile.name}`}
                                            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:border-primary hover:text-primary dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition focus-visible:outline-2 focus-visible:outline-primary"
                                        >
                                            <FaInstagram className="w-4 h-4" aria-hidden="true" />
                                        </a>
                                    )}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-xs font-semibold text-gray-800 dark:text-slate-200 hover:border-primary hover:text-primary dark:hover:border-indigo-400 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
                            >
                                {copied ? (
                                    <>
                                        <FiCheck
                                            className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
                                            aria-hidden="true"
                                        />
                                        <span className="text-emerald-700 dark:text-emerald-300">
                                            Tautan Tersalin
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FiShare2 className="w-3.5 h-3.5" aria-hidden="true" />
                                        <span>Salin Tautan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Section Quick Jump */}
                    {sectionAnchors.length > 1 && (
                        <nav
                            aria-label="Navigasi bagian portofolio"
                            className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1"
                        >
                            {sectionAnchors.map((anchor) => (
                                <a
                                    key={anchor.id}
                                    href={`#${anchor.id}`}
                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-300 bg-gray-100/80 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/25 dark:hover:text-indigo-200 transition whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary"
                                >
                                    {anchor.label}
                                </a>
                            ))}
                        </nav>
                    )}
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Sidebar: Bio, Skills, Summary, Organization */}
                {hasSidebarInfo && (
                    <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                        {(profile.bio || profile.skills.length > 0) && (
                            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-5">
                                {profile.bio && (
                                    <div className="space-y-2">
                                        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                            Tentang
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                                            {profile.bio}
                                        </p>
                                    </div>
                                )}

                                {profile.skills.length > 0 && (
                                    <div
                                        className={
                                            profile.bio
                                                ? "pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2.5"
                                                : "space-y-2.5"
                                        }
                                    >
                                        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                            Keahlian
                                        </h2>
                                        <ul className="flex flex-wrap gap-1.5">
                                            {profile.skills.map((skill) => (
                                                <li
                                                    key={skill}
                                                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-200/70 dark:border-slate-700/70"
                                                >
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        )}

                        {hasMainContent && (
                            <section
                                aria-label="Ringkasan portofolio"
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 grid grid-cols-2 gap-4"
                            >
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        Proyek
                                    </p>
                                    <p className="font-archivo text-2xl text-gray-900 dark:text-white mt-0.5">
                                        {projects.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        Prestasi
                                    </p>
                                    <p className="font-archivo text-2xl text-gray-900 dark:text-white mt-0.5">
                                        {achievements.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        Sertifikat
                                    </p>
                                    <p className="font-archivo text-2xl text-gray-900 dark:text-white mt-0.5">
                                        {certificates.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        Kepanitiaan
                                    </p>
                                    <p className="font-archivo text-2xl text-gray-900 dark:text-white mt-0.5">
                                        {committees.length}
                                    </p>
                                </div>
                            </section>
                        )}

                        {organization_history.length > 0 && (
                            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <FiUsers className="w-4 h-4 text-primary dark:text-indigo-400" aria-hidden="true" />
                                    <span>Riwayat Kepengurusan</span>
                                </h2>

                                <ol className="relative border-l border-gray-200 dark:border-slate-700 ml-2 space-y-5">
                                    {organization_history.map((org, idx) => (
                                        <li
                                            key={`${org.kabinet}-${org.jabatan}-${idx}`}
                                            className="pl-5 relative"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                                                    org.is_active
                                                        ? "bg-emerald-500"
                                                        : "bg-gray-300 dark:bg-slate-600"
                                                }`}
                                            />
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {org.jabatan ?? "Pengurus"}
                                                </p>
                                                {org.is_active && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                                                        Aktif
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                                                {[org.departemen, org.kabinet, org.year]
                                                    .filter(Boolean)
                                                    .join(" / ")}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        )}
                    </aside>
                )}

                {/* Right Main Column: Projects, Achievements, Certificates, Committees */}
                <div
                    className={
                        hasSidebarInfo
                            ? "lg:col-span-8 space-y-10 min-w-0"
                            : "lg:col-span-12 space-y-10 min-w-0"
                    }
                >
                    {/* Projects Section */}
                    {projects.length > 0 && (
                        <section id="proyek" className="scroll-mt-28 space-y-4">
                            <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-3">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiFolder
                                        className="w-5 h-5 text-primary dark:text-indigo-400"
                                        aria-hidden="true"
                                    />
                                    <span>Proyek</span>
                                </h2>
                                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                                    {projects.length} karya
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {projects.map((project, index) => {
                                    const coverUrl = resolveImageUrl(project.cover_image);
                                    const cleanDesc = project.description
                                        ? stripHtml(project.description)
                                        : null;
                                    const isFeatured = index === 0 && projects.length % 2 === 1;

                                    return (
                                        <article
                                            key={project.id}
                                            className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 overflow-hidden flex flex-col hover:border-primary/40 dark:hover:border-indigo-500/50 transition ${
                                                isFeatured ? "md:col-span-2 md:flex-row" : ""
                                            }`}
                                        >
                                            {coverUrl && (
                                                <div
                                                    className={`bg-gray-100 dark:bg-slate-800 overflow-hidden shrink-0 ${
                                                        isFeatured
                                                            ? "aspect-[16/9] md:aspect-auto md:w-72 lg:w-80"
                                                            : "aspect-[16/9] w-full"
                                                    }`}
                                                >
                                                    <img
                                                        src={coverUrl}
                                                        alt={`Cover proyek ${project.title}`}
                                                        width={640}
                                                        height={360}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-5 flex flex-col flex-1 space-y-3 min-w-0">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary dark:bg-primary/25 dark:text-indigo-200">
                                                        {project.role}
                                                    </span>
                                                    {project.published_at && (
                                                        <span className="text-xs text-gray-500 dark:text-slate-400">
                                                            {formatTimestamp(project.published_at)}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
                                                    {project.title}
                                                </h3>

                                                {cleanDesc && (
                                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 line-clamp-3 flex-1 leading-relaxed">
                                                        {cleanDesc}
                                                    </p>
                                                )}

                                                {(project.slug || project.project_url) && (
                                                    <div className="pt-3 flex flex-wrap items-center gap-4 border-t border-gray-100 dark:border-slate-800">
                                                        {project.slug && (
                                                            <Link
                                                                href={`/project/${project.slug}`}
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-indigo-300 hover:underline focus-visible:outline-2 focus-visible:outline-primary rounded"
                                                            >
                                                                <span>Lihat Detail</span>
                                                                <FiArrowUpRight
                                                                    className="w-3.5 h-3.5"
                                                                    aria-hidden="true"
                                                                />
                                                            </Link>
                                                        )}
                                                        {project.project_url && (
                                                            <a
                                                                href={project.project_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:text-primary dark:hover:text-indigo-300 focus-visible:outline-2 focus-visible:outline-primary rounded"
                                                            >
                                                                <span>Tautan Proyek</span>
                                                                <FiExternalLink
                                                                    className="w-3 h-3"
                                                                    aria-hidden="true"
                                                                />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Achievements Section */}
                    {achievements.length > 0 && (
                        <section id="prestasi" className="scroll-mt-28 space-y-4">
                            <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-3">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiAward
                                        className="w-5 h-5 text-primary dark:text-indigo-400"
                                        aria-hidden="true"
                                    />
                                    <span>Prestasi</span>
                                </h2>
                                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                                    {achievements.length} pencapaian
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {achievements.map((item) => {
                                    const coverUrl = resolveImageUrl(item.cover_image);

                                    return (
                                        <article
                                            key={item.id}
                                            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 flex gap-4 items-start"
                                        >
                                            {coverUrl ? (
                                                <img
                                                    src={coverUrl}
                                                    alt={`Dokumentasi ${item.title}`}
                                                    width={64}
                                                    height={64}
                                                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100 dark:border-slate-800"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div
                                                    aria-hidden="true"
                                                    className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200/70 dark:border-amber-800/50"
                                                >
                                                    <FiAward className="w-5 h-5" />
                                                </div>
                                            )}

                                            <div className="min-w-0 flex-1 space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {item.level && (
                                                        <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
                                                            {item.level}
                                                        </span>
                                                    )}
                                                    {item.date_achieved && (
                                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
                                                            <FiCalendar className="w-3 h-3" aria-hidden="true" />
                                                            {formatDate(item.date_achieved)}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                                    {item.title}
                                                </h3>
                                                {item.description && (
                                                    <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Certificates Section */}
                    {certificates.length > 0 && (
                        <section id="sertifikat" className="scroll-mt-28 space-y-4">
                            <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-3">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiShield
                                        className="w-5 h-5 text-primary dark:text-indigo-400"
                                        aria-hidden="true"
                                    />
                                    <span>Sertifikat Terverifikasi</span>
                                </h2>
                                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                                    {certificates.length} sertifikat
                                </span>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800">
                                {certificates.map((cert) => (
                                    <div
                                        key={cert.id}
                                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                                <FiCheckCircle
                                                    className="w-3.5 h-3.5 shrink-0"
                                                    aria-hidden="true"
                                                />
                                                <span className="truncate font-mono">
                                                    {cert.certificate_number}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                                {cert.event?.title ?? "Kegiatan HIMA-IF"}
                                            </h3>
                                            {cert.issued_at && (
                                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                                    Diterbitkan {formatDate(cert.issued_at)}
                                                </p>
                                            )}
                                        </div>

                                        <Link
                                            href={`/certificates/${cert.short_code}`}
                                            className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl bg-primary/10 text-primary dark:bg-primary/25 dark:text-indigo-200 text-xs font-semibold hover:bg-primary hover:text-white transition shrink-0 focus-visible:outline-2 focus-visible:outline-primary"
                                        >
                                            <span>Verifikasi</span>
                                            <FiArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Committees Section */}
                    {committees.length > 0 && (
                        <section id="kepanitiaan" className="scroll-mt-28 space-y-4">
                            <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-3">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiBriefcase
                                        className="w-5 h-5 text-primary dark:text-indigo-400"
                                        aria-hidden="true"
                                    />
                                    <span>Kepanitiaan Kegiatan</span>
                                </h2>
                                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                                    {committees.length} kegiatan
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {committees.map((committee) => (
                                    <div
                                        key={committee.id}
                                        className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200/80 dark:border-slate-800 p-4 space-y-1"
                                    >
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            {committee.event?.title ?? "Kegiatan HIMA-IF"}
                                        </p>
                                        {committee.role && (
                                            <p className="text-xs font-semibold text-primary dark:text-indigo-300">
                                                {committee.role}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {!hasMainContent && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-8 text-center space-y-2">
                            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                                Portofolio Belum Dipublikasikan
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
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

export default ModuleProfileTalentDetailPage;
