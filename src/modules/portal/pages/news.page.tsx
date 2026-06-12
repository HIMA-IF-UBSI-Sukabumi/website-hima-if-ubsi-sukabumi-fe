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

    const news = data?.data ?? [];

    const latestNews = news[0];
    const otherNews = news.slice(1);

    if (isLoading) {
        return (
            <section className="mt-38 pb-20 max-w-6xl mx-auto px-4">
                <h1 className="text-2xl font-black">Berita & Artikel Terbaru</h1>

                <div className="mt-6 text-center py-20">
                    Memuat berita...
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="mt-38 pb-20 max-w-6xl mx-auto px-4">
                <h1 className="text-2xl font-black">Berita & Artikel Terbaru</h1>

                <div className="mt-6 text-center py-20 text-red-500">
                    Gagal memuat berita.
                </div>
            </section>
        );
    }

    if (news.length === 0) {
        return (
            <section className="overflow-hidden mt-38 pb-20 max-w-6xl mx-auto px-4">
                <h1 className="text-2xl font-black">
                    Berita & Artikel Terbaru
                </h1>

                <div className="flex flex-col items-center justify-center mt-10 text-center px-4">
                    <p className="text-base md:text-lg font-semibold text-gray-700">
                        Belum ada berita
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Nantikan informasi dan artikel terbaru dari kami 📰
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden mt-38 pb-20 max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-black">Berita & Artikel Terbaru</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4">
                <CardNews
                    title={latestNews.title}
                    description={latestNews.content}
                    image={`${storageUrl}/${latestNews.cover}`}
                    date={formatTimestamp(latestNews.created_at)}
                />

                <div className="flex flex-col gap-4 min-h-100 max-h-115 overflow-y-auto">
                    {otherNews.map((item) => (
                        <CardNewsCompact
                            key={item.id}
                            title={item.title}
                            category={item.category?.[0] ?? '-'}
                            image={`${storageUrl}/${item.cover}`}
                            date={formatTimestamp(item.created_at)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ModulePortalNewsPage;