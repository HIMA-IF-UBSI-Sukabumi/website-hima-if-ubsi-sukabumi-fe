'use client'

import CardNews from "@/modules/portal/components/CardNews";
import CardNewsCompact from "@/modules/portal/components/CardNewsCompact";
import useAxios from "@/core/hooks/use-axios";
import {formatTimestamp, getStorageUrl} from "@/lib/utils";
import {useQuery} from "@tanstack/react-query";
import {newsService} from "@/modules/portal/services/api/news.service";

const ModulePortalNewsPage = () => {
    const axios = useAxios();
    const storageUrl = getStorageUrl();

    const {data, isLoading, isError} = useQuery({
        queryKey: ['news-data'],
        queryFn: async () => await newsService.findAll(axios, null)
    });

    if (isLoading) {
        return (
            <section className="mt-32 pb-20 max-w-6xl mx-auto px-4 animate-pulse">
                <div className="h-6 w-64 bg-gray-200 rounded mb-6"/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-96 bg-gray-200 rounded-2xl"/>

                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-20 bg-gray-200 rounded-xl"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="mt-32 pb-20 max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-xl font-bold text-red-500">
                    Gagal memuat berita 😵
                </h2>

                <p className="text-gray-500 mt-2">
                    Silakan coba lagi beberapa saat
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary/90"
                >
                    Retry
                </button>
            </section>
        );
    }

    const apiNews = data?.data ?? [];

    if (apiNews.length === 0) {
        return (
            <section className="mt-32 pb-20 max-w-6xl mx-auto px-4">
                <div className="text-center py-16 rounded-3xl border border-gray-100 bg-gray-50">

                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        Belum ada berita
                    </h2>

                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                        Silakan cek kembali nanti atau ikuti update terbaru dari kami
                    </p>

                    <div className="mt-6">
                        <div className="w-24 h-1 mx-auto bg-gray-200 rounded-full"/>
                    </div>

                </div>
            </section>
        );
    }

    const latestNews = apiNews[0];
    const otherNews = apiNews.slice(1);

    return (
        <section className="overflow-hidden mt-38 pb-20 max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-black">
                Berita & Artikel Terbaru
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4">

                <CardNews
                    title={latestNews.news.title}
                    description={latestNews.news.content}
                    image={`${storageUrl}/${latestNews.news.cover}`}
                    date={formatTimestamp(latestNews.news.created_at)}
                    href={`/news/${latestNews.news.slug}`}
                />

                <div className="flex flex-col gap-4 max-h-115 overflow-y-auto">
                    {otherNews.map((item) => (
                        <CardNewsCompact
                            key={item.news.id}
                            title={item.news.title}
                            category={item.news.category?.[0] ?? '-'}
                            image={`${storageUrl}/${item.news.cover}`}
                            date={formatTimestamp(item.news.created_at)}
                            href={`/news/${item.news.slug}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ModulePortalNewsPage;