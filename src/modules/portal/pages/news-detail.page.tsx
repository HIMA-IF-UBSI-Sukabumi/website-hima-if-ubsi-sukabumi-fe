'use client'

import {FiClock, FiArrowLeft, FiTag} from "react-icons/fi";
import Link from "next/link";
import {dummyNews} from "@/constants/dummy-news";
import {formatTimestamp} from "@/lib/utils";
import {notFound} from "next/navigation";

type NewsDetailPageProps = {
    slug: string;
}

const ModulePortalNewsDetailPage = ({slug}: NewsDetailPageProps) => {
    const news = dummyNews.find((n) => (n.slug ?? n.id) === slug);

    if (!news) {
        notFound();
    }

    const otherNews = dummyNews
        .filter((n) => (n.slug ?? n.id) !== slug)
        .slice(0, 3);

    return (
        <section className="mt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
                href="/news"
                className="inline-flex items-center gap-2 text-secondary hover:text-primary transition font-medium text-sm mb-8"
            >
                <FiArrowLeft className="w-4 h-4"/>
                Kembali ke Berita
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Category Badges */}
                    {news.category.length > 0 && (
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

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-archivo font-black text-black leading-tight">
                        {news.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-2 mt-4 text-sm text-secondary">
                        <FiClock className="w-4 h-4"/>
                        <span>{formatTimestamp(news.created_at)}</span>
                    </div>

                    {/* Cover Image */}
                    <div className="mt-6 rounded-3xl overflow-hidden border border-smoky shadow-md">
                        <img
                            src={news.cover
                                ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${news.cover}`
                                : `https://picsum.photos/seed/${news.id}/900/500`}
                            alt={news.title}
                            className="w-full h-64 sm:h-80 md:h-96 object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div
                        className="mt-8 prose prose-base max-w-none prose-headings:font-archivo prose-headings:text-black prose-p:text-gray-600 prose-p:leading-relaxed prose-blockquote:border-primary prose-blockquote:text-secondary prose-li:text-gray-600 prose-strong:text-black"
                        dangerouslySetInnerHTML={{__html: news.content}}
                    />

                    {/* Tags Footer */}
                    {news.category.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
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

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-36">
                        <h2 className="text-base font-black text-black mb-4">
                            Berita Lainnya
                        </h2>
                        <div className="flex flex-col gap-3">
                            {otherNews.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/news/${item.slug ?? item.id}`}
                                    className="flex items-start gap-3 p-3 rounded-2xl hover:bg-smoky transition group"
                                >
                                    <div className="w-16 h-16 min-w-16 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.cover
                                                ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.cover}`
                                                : `https://picsum.photos/seed/${item.id}/200/200`}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-primary tracking-wide uppercase mb-1">
                                            {item.category[0] ?? 'HIMA NEWS'}
                                        </p>
                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
                                            <FiClock className="w-3 h-3"/>
                                            <span>{formatTimestamp(item.created_at)}</span>
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
