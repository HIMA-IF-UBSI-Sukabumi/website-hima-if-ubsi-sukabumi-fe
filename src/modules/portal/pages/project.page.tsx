'use client';

import { useState, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import { projectService, ProjectItem } from "@/modules/portal/services/api/project.service";
import CardProject from "@/modules/portal/components/CardProject";
import { FiSearch, FiX, FiRefreshCw, FiCode, FiLayers, FiAlertCircle } from "react-icons/fi";

const ProjectCardSkeleton = () => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse flex flex-col">
        <div className="aspect-[16/10] bg-gray-200 w-full" />
        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <div className="h-3 w-24 bg-gray-200 rounded-full" />
                    <div className="h-3 w-20 bg-gray-200 rounded-full" />
                </div>
                <div className="h-5 w-4/5 bg-gray-200 rounded-md" />
                <div className="h-4 w-full bg-gray-200 rounded-md" />
                <div className="h-4 w-2/3 bg-gray-200 rounded-md" />
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="h-4 w-28 bg-gray-200 rounded-full" />
                <div className="h-4 w-16 bg-gray-200 rounded-full" />
            </div>
        </div>
    </div>
);

const ModulePortalProjectPage = () => {
    const axios = useAxios();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search input by 350ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery.trim());
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const {
        data,
        isLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["portal-projects", debouncedSearch],
        queryFn: async ({ pageParam }) =>
            await projectService.findAll(axios, {
                search: debouncedSearch || undefined,
                cursor: pageParam ? String(pageParam) : undefined,
                per_page: 12,
            }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) =>
            lastPage?.next_cursor ? String(lastPage.next_cursor) : undefined,
    });

    const allProjects: ProjectItem[] = useMemo(
        () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
        [data]
    );

    return (
        <section className="relative overflow-hidden mt-32 md:mt-36 pb-20 md:pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header / Hero Section */}
            <div className="relative text-center max-w-3xl mx-auto mb-12 md:mb-16">
                {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
                    <FiCode className="w-3.5 h-3.5" />
                    <span>Showcase Karya Mahasiswa</span>
                </div> */}

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-archivo font-extrabold text-black leading-tight">
                    Karya & Proyek Inovasi
                </h1>

                <p className="mt-4 text-base sm:text-lg text-secondary leading-relaxed">
                    Eksplorasi ragam aplikasi web, mobile, sistem informasi, dan hasil riset teknologi
                    yang dikembangkan dengan dedikasi oleh mahasiswa Informatika UBSI Sukabumi.
                </p>

                {/* Search Bar */}
                <div className="mt-8 max-w-xl mx-auto">
                    <div className="relative flex items-center bg-white rounded-full border border-gray-200 shadow-md shadow-black/5 hover:border-primary/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all p-1.5 pl-5">
                        <FiSearch className="w-5 h-5 text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari judul proyek, topik, atau kata kunci..."
                            className="w-full px-3 py-2 text-sm sm:text-base text-gray-900 placeholder-gray-400 bg-transparent outline-none font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                                aria-label="Bersihkan pencarian"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {debouncedSearch && (
                        <p className="mt-3 text-xs text-gray-500">
                            Menampilkan hasil untuk:{" "}
                            <span className="font-semibold text-primary">
                                &ldquo;{debouncedSearch}&rdquo;
                            </span>
                        </p>
                    )}
                </div>
            </div>

            {/* Error State */}
            {isError && (
                <div className="max-w-md mx-auto text-center py-12 px-6 bg-red-50 rounded-3xl border border-red-100">
                    <FiAlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Gagal Memuat Proyek</h3>
                    <p className="text-sm text-gray-600 mb-5">
                        Terjadi kesalahan saat mengambil data proyek. Silakan coba kembali.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition shadow-sm"
                    >
                        <FiRefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && !isError && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[...Array(6)].map((_, i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && allProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white/70 border border-gray-100 rounded-3xl shadow-sm max-w-xl mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <FiLayers className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-archivo text-gray-900">
                        {debouncedSearch ? "Proyek Tidak Ditemukan" : "Belum Ada Proyek"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-sm">
                        {debouncedSearch
                            ? `Tidak ada proyek yang sesuai dengan kata kunci "${debouncedSearch}". Coba kata kunci lain.`
                            : "Saat ini belum ada proyek mahasiswa yang dipublikasikan. Nantikan karya-karya hebat lainnya segera!"}
                    </p>
                    {debouncedSearch && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-6 px-5 py-2 bg-primary/10 text-primary font-bold text-xs rounded-full hover:bg-primary/20 transition"
                        >
                            Tampilkan Semua Proyek
                        </button>
                    )}
                </div>
            )}

            {/* Projects Grid */}
            {!isLoading && !isError && allProjects.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {allProjects.map((project) => (
                            <CardProject key={project.id} project={project} />
                        ))}
                    </div>

                    {/* Pagination / Load More */}
                    {hasNextPage && (
                        <div className="mt-14 flex flex-col items-center justify-center gap-3">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isFetchingNextPage ? (
                                    <>
                                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Memuat Proyek...</span>
                                    </>
                                ) : (
                                    <span>Muat Lebih Banyak Proyek</span>
                                )}
                            </button>
                            <span className="text-xs text-gray-400">
                                Menampilkan {allProjects.length} proyek
                            </span>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default ModulePortalProjectPage;
