'use client'

import {FiClock, FiArrowLeft, FiTag} from "react-icons/fi";
import Link from "next/link";
import {useQuery} from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import {newsService} from "@/modules/portal/services/api/news.service";
import {getStorageUrl} from "@/lib/utils";
import {notFound} from "next/navigation";

type NewsDetailPageProps = {
    slug: string;
};

const ModulePortalNewsDetailPage = ({slug}: NewsDetailPageProps) => {
    const axios = useAxios();
    const storageUrl = getStorageUrl();

    const {data, isLoading, isError} = useQuery({
        queryKey: ["news-detail", slug],
        queryFn: async () => await newsService.findBySlug(axios, slug),
    });

    if (isLoading) {
        return (
            <section className="mt-32 max-w-5xl mx-auto px-4 animate-pulse py-4">
                <div className="h-4 w-40 bg-gray-200 rounded mb-6"/>
                <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"/>
                <div className="h-96 bg-gray-200 rounded-3xl"/>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="mt-32 text-center">
                <h2 className="text-xl font-bold text-red-500">
                    Gagal memuat berita
                </h2>
            </section>
        );
    }

    const news = data?.news;

    if (!news) {
        notFound();
    }

    const relatedNews = news.related_news ?? [];

    return (
        <section className="mt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            <Link
                href="/news"
                className="inline-flex items-center gap-2 text-secondary hover:text-primary transition font-medium text-sm mb-8"
            >
                <FiArrowLeft className="w-4 h-4"/>
                Kembali ke Berita
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                <div className="lg:col-span-2">
                    {news.category?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {news.category.map((cat) => (
                                <span
                                    key={cat}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-smoky px-3 py-1 rounded-full"
                                >
                                    <FiTag className="w-3 h-3"/>
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="text-xl sm:text-2xl md:text-3xl font-archivo font-bold text-black leading-tight">
                        {news.title}
                    </h1>

                    <div className="flex items-center gap-2 mt-4 text-sm text-secondary">
                        <FiClock className="w-4 h-4"/>
                        <span>{news.published_at}</span>
                    </div>

                    <div className="mt-6 rounded-3xl overflow-hidden border border-smoky shadow-md">
                        <img
                            src={`${storageUrl}/${news.cover}`}
                            alt={news.title}
                            className="w-full h-64 sm:h-80 md:h-96 object-cover"
                        />
                    </div>

                    <div
                        className="mt-8 prose max-w-none prose-p:text-gray-600 prose-headings:text-black text-justify"
                        dangerouslySetInnerHTML={{__html: news.content}}
                    />

                    {news.category?.length > 0 && (
                        <div className="mt-10 pt-6 border-t flex flex-wrap gap-2">
                            {news.category.map((cat) => (
                                <span
                                    key={cat}
                                    className="text-xs font-medium text-secondary bg-gray-100 px-3 py-1 rounded-full"
                                >
                                    #{cat}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-36">

                        <h2 className="text-base font-black mb-4">
                            Berita Lainnya
                        </h2>

                        <div className="flex flex-col gap-3">
                            {relatedNews.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/news/${item.slug}`}
                                    className="flex gap-3 p-3 rounded-2xl hover:bg-smoky transition group"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={`${storageUrl}/${item.cover}`
                                            }
                                            className="w-full h-full object-cover"
                                            alt={item.title}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-primary uppercase mb-1">
                                            {item.category?.[0] ?? "NEWS"}
                                        </p>

                                        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary">
                                            {item.title}
                                        </h3>

                                        <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
                                            <FiClock className="w-3 h-3"/>
                                            <span>{item.published_at}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            href="/news"
                            className="mt-6 block text-center text-sm font-semibold text-primary hover:underline"
                        >
                            Lihat semua berita →
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModulePortalNewsDetailPage;