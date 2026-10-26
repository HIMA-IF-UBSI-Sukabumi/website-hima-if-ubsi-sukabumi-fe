'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import { projectService, ProjectItem } from "@/modules/portal/services/api/project.service";
import { formatTimestamp, resolveImageUrl } from "@/lib/utils";
import {
    FiArrowLeft,
    FiCalendar,
    FiExternalLink,
    FiShare2,
    FiCopy,
    FiCheck,
    FiImage,
    FiChevronRight,
    FiChevronLeft,
    FiX,
    FiLayers,
} from "react-icons/fi";
import { FaWhatsapp, FaXTwitter, FaLinkedin } from "react-icons/fa6";

type ProjectDetailPageProps = {
    slug: string;
};

// Helper to normalize images from object or array format
function extractImageList(
    images?: Record<string, string> | string[] | null
): string[] {
    if (!images) return [];
    if (Array.isArray(images)) {
        return images.map((img) => resolveImageUrl(img)).filter(Boolean);
    }
    if (typeof images === "object") {
        return Object.values(images).map((img) => resolveImageUrl(img)).filter(Boolean);
    }
    return [];
}

const ModulePortalProjectDetailPage = ({ slug }: ProjectDetailPageProps) => {
    const axios = useAxios();
    const [copied, setCopied] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["portal-project-detail", slug],
        queryFn: async () => await projectService.findBySlug(axios, slug),
    });

    const project = data?.project;

    // Loading Skeleton
    if (isLoading) {
        return (
            <section className="mt-32 md:mt-36 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                <div className="h-4 w-40 bg-gray-200 rounded-full mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-6 w-32 bg-gray-200 rounded-full" />
                        <div className="h-10 w-4/5 bg-gray-200 rounded-xl" />
                        <div className="h-4 w-2/5 bg-gray-200 rounded-md" />
                        <div className="aspect-[16/10] bg-gray-200 rounded-3xl w-full" />
                        <div className="space-y-3 pt-4">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-4/6" />
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4">
                            <div className="h-5 w-32 bg-gray-200 rounded" />
                            <div className="h-12 w-full bg-gray-200 rounded-2xl" />
                            <div className="h-12 w-full bg-gray-200 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !project) {
        notFound();
    }

    const coverUrl = resolveImageUrl(project.cover_image);
    const carouselImages = extractImageList(project.carousel_images);
    const galleryImages = extractImageList(project.gallery_images);

    // Combine all unique screenshots for lightbox preview
    const allScreenshots = Array.from(
        new Set([coverUrl, ...carouselImages, ...galleryImages].filter(Boolean))
    );

    const otherProjects = project.other_projects ?? [];

    const shareText = `Lihat proyek inovasi "${project.title}" karya mahasiswa HIMA-IF UBSI Sukabumi:`;

    const handleCopyLink = () => {
        const url = currentUrl || (typeof window !== "undefined" ? window.location.href : "");
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleSharePlatform = (platform: "wa" | "twitter" | "linkedin") => {
        const url = currentUrl || (typeof window !== "undefined" ? window.location.href : "");
        let targetUrl = "";

        if (platform === "wa") {
            targetUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`;
        } else if (platform === "twitter") {
            targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
        } else if (platform === "linkedin") {
            targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        }

        if (targetUrl && typeof window !== "undefined") {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
        }
    };

    const authorInitials = project.author?.name
        ? project.author.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()
        : "IF";

    return (
        <section className="relative mt-32 md:mt-36 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Navigation */}
            <div className="mb-8">
                <Link
                    href="/project"
                    className="inline-flex items-center gap-2.5 text-secondary hover:text-primary transition-all duration-200 font-medium text-sm group"
                >
                    <span className="w-8 h-8 rounded-full bg-smoky flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                        <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    </span>
                    <span>Kembali ke Semua Proyek</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* ── Main Content Column ── */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Area */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Proyek Mahasiswa
                            </span>
                            <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                                {project.status === "published" ? "Dipublikasikan" : project.status}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-archivo font-extrabold text-black leading-tight tracking-tight">
                            {project.title}
                        </h1>

                        {/* Author & Meta Line */}
                        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                                    {authorInitials}
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                                        Pengembang
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {project.author?.name ?? "Mahasiswa Informatika"}
                                    </p>
                                </div>
                            </div>

                            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-smoky flex items-center justify-center text-secondary">
                                    <FiCalendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                                        Dipublikasikan
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {project.published_at ? formatTimestamp(project.published_at) : "Terbaru"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Cover Image */}
                    {coverUrl && (
                        <div
                            onClick={() => setLightboxIndex(0)}
                            className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-md bg-gray-100 border border-gray-100 group cursor-pointer"
                        >
                            <img
                                src={coverUrl}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-gray-900 shadow-lg">
                                    <FiImage className="w-4 h-4" />
                                    Klik untuk memperbesar
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Additional Screenshots Gallery / Carousel */}
                    {(carouselImages.length > 0 || galleryImages.length > 0) && (
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold font-archivo text-black flex items-center gap-2">
                                    <FiImage className="w-5 h-5 text-primary" />
                                    Tangkapan Layar & Galeri
                                </h2>
                                <span className="text-xs text-gray-400 font-medium">
                                    {allScreenshots.length} gambar
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                {allScreenshots.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setLightboxIndex(idx)}
                                        className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`${project.title} screenshot ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                            <FiImage className="w-5 h-5" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Project Description Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-bold font-archivo text-black mb-5 pb-3 border-b border-gray-100">
                            Tentang Proyek Ini
                        </h2>

                        {project.description ? (
                            <div
                                className="prose prose-sm sm:prose-base max-w-none text-gray-700 text-justify leading-relaxed prose-headings:font-archivo prose-headings:text-black prose-a:text-primary prose-img:rounded-2xl"
                                dangerouslySetInnerHTML={{ __html: project.description }}
                            />
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                Belum ada deskripsi lengkap untuk proyek ini.
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Sidebar Column ── */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="lg:sticky lg:top-36 space-y-6">
                        {/* Action CTA Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
                            <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary absolute top-0 left-0" />
                            <h2 className="text-base font-black text-black mb-4">
                                Akses & Repository
                            </h2>

                            {project.project_url ? (
                                <div className="space-y-4">
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Proyek ini memiliki tautan repositori atau demo langsung yang dapat Anda kunjungi:
                                    </p>
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all duration-200"
                                    >
                                        <FiExternalLink className="w-4 h-4" />
                                        <span>Buka Proyek / Demo</span>
                                    </a>
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-2xl text-center text-xs text-gray-500">
                                    Tautan repositori privat atau belum dipublikasikan oleh pengembang.
                                </div>
                            )}

                            {/* Copy Link Action */}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-medium">
                                    Salin tautan halaman
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition"
                                >
                                    {copied ? (
                                        <>
                                            <FiCheck className="w-3.5 h-3.5 text-green-600" />
                                            <span className="text-green-600">Tersalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiCopy className="w-3.5 h-3.5" />
                                            <span>Salin Link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Author Info Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-base font-black text-black mb-4">
                                Tentang Pengembang
                            </h2>
                            <div className="flex items-center gap-3.5 mb-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0">
                                    {authorInitials}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-gray-900 text-sm truncate">
                                        {project.author?.name ?? "Mahasiswa Informatika"}
                                    </h3>
                                    <p className="text-xs text-gray-400 truncate">
                                        UBSI PSDKU Sukabumi
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed pt-2 border-t border-gray-100">
                                Bagian dari talenta teknologi dan inovator muda Himpunan Mahasiswa Informatika.
                            </p>
                        </div>

                        {/* Share Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-base font-black text-black mb-3 flex items-center gap-2">
                                <FiShare2 className="w-4 h-4 text-primary" />
                                Bagikan Proyek
                            </h2>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => handleSharePlatform("wa")}
                                    className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition flex items-center justify-center shadow-sm cursor-pointer"
                                    title="Bagikan ke WhatsApp"
                                    aria-label="Bagikan ke WhatsApp"
                                >
                                    <FaWhatsapp className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSharePlatform("twitter")}
                                    className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-700 hover:bg-black hover:text-white transition flex items-center justify-center shadow-sm cursor-pointer"
                                    title="Bagikan ke X (Twitter)"
                                    aria-label="Bagikan ke X"
                                >
                                    <FaXTwitter className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSharePlatform("linkedin")}
                                    className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center shadow-sm cursor-pointer"
                                    title="Bagikan ke LinkedIn"
                                    aria-label="Bagikan ke LinkedIn"
                                >
                                    <FaLinkedin className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-600 hover:bg-primary hover:text-white transition flex items-center justify-center shadow-sm ml-auto cursor-pointer"
                                    title="Salin tautan proyek"
                                    aria-label="Salin tautan proyek"
                                >
                                    {copied ? <FiCheck className="w-4 h-4 text-green-600" /> : <FiCopy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Other Recommended Projects */}
                        {otherProjects.length > 0 && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-base font-black text-black flex items-center gap-2">
                                        <FiLayers className="w-4 h-4 text-primary" />
                                        Proyek Lainnya
                                    </h2>
                                    <Link
                                        href="/project"
                                        className="text-xs font-semibold text-primary hover:underline"
                                    >
                                        Lihat Semua
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {otherProjects.map((item: ProjectItem) => {
                                        const otherCover = resolveImageUrl(item.cover_image);
                                        return (
                                            <Link
                                                key={item.id}
                                                href={`/project/${item.slug}`}
                                                className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-smoky/60 transition-all duration-200"
                                            >
                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {otherCover ? (
                                                        <img
                                                            src={otherCover}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                            💻
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                                                        {item.author?.name ?? "Mahasiswa IF"}
                                                    </p>
                                                </div>
                                                <FiChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && allScreenshots[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
                        aria-label="Tutup pratinjau"
                    >
                        <FiX className="w-6 h-6" />
                    </button>

                    {allScreenshots.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) =>
                                        prev === null || prev === 0
                                            ? allScreenshots.length - 1
                                            : prev - 1
                                    );
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
                                aria-label="Gambar sebelumnya"
                            >
                                <FiChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) =>
                                        prev === null || prev === allScreenshots.length - 1
                                            ? 0
                                            : prev + 1
                                    );
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
                                aria-label="Gambar berikutnya"
                            >
                                <FiChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    <div
                        className="max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={allScreenshots[lightboxIndex]}
                            alt={`Preview ${lightboxIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                        />
                    </div>

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium">
                        {lightboxIndex + 1} / {allScreenshots.length}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ModulePortalProjectDetailPage;
