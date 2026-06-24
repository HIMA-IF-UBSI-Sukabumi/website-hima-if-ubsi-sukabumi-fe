'use client'

import { useQuery } from '@tanstack/react-query'
import useAxios from '@/core/hooks/use-axios'
import { newsService, NEWS_CATEGORIES, Category } from '@/modules/news/services/api/news.service'
import { getStorageUrl, formatTimestamp } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiClock, FiTag, FiArrowLeft, FiShare2 } from 'react-icons/fi'
import NewsCardCompact from '@/modules/news/components/NewsCardCompact'

type NewsDetailPageProps = {
    slug: string
}

const ModuleNewsDetailPage = ({ slug }: NewsDetailPageProps) => {
    const axios = useAxios()
    const storageUrl = getStorageUrl()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['news-detail', slug],
        queryFn: async () => await newsService.findBySlug(axios, slug),
    })

    const { data: categoriesData } = useQuery({
        queryKey: ['news-categories'],
        queryFn: async () => await newsService.findCategories(axios),
        staleTime: 10 * 60 * 1000,
    })
    const categories: Category[] = categoriesData?.categories ?? []

    // Estimate reading time
    const estimateReadTime = (html: string) => {
        const words = html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
        return Math.max(1, Math.ceil(words / 200))
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: data?.news?.title ?? '',
                url: window.location.href,
            }).catch(() => { })
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link disalin ke clipboard!')
            })
        }
    }

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="animate-pulse">
                {/* Cover skeleton */}
                <div className="w-full h-64 sm:h-80 md:h-[460px] bg-gray-200" />
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-4 w-32 bg-gray-200 rounded-full" />
                            <div className="h-8 w-3/4 bg-gray-200 rounded-full" />
                            <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
                            <div className="space-y-2 mt-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-3.5 bg-gray-200 rounded-full" style={{ width: `${70 + Math.random() * 30}%` }} />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-24 text-center">
                <h2 className="text-xl font-bold text-red-500 mb-2">Gagal memuat berita</h2>
                <p className="text-gray-500 text-sm mb-6">Silakan coba lagi beberapa saat.</p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Kembali ke Beranda
                </Link>
            </div>
        )
    }

    const news = data?.news
    if (!news) {
        notFound()
    }

    const relatedNews = news.related_news ?? []
    const readTime = estimateReadTime(news.content)

    return (
        <div>
            {/* ── CINEMATIC COVER ── */}
            <div className="relative w-full h-56 sm:h-80 md:h-[460px] overflow-hidden">
                <img
                    src={`${storageUrl}/${news.cover}`}
                    alt={news.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category badge over cover */}
                {news.category && (
                    <div className="absolute bottom-6 left-4 sm:left-8 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-white px-3 py-1 rounded-full">
                            <FiTag className="w-2.5 h-2.5" />
                            {news.category.name}
                        </span>
                    </div>
                )}
            </div>

            {/* ── CONTENT AREA ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition mb-6"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Kembali ke Beranda Berita
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* ── MAIN ARTICLE ── */}
                    <article className="lg:col-span-2">
                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-archivo font-black text-black leading-tight">
                            {news.title}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <FiClock className="w-4 h-4 shrink-0" />
                                <span>{news.published_at}</span>
                            </div>
                            <span className="text-gray-200">|</span>
                            <span className="text-gray-400">{readTime} menit baca</span>
                            {news.author && (
                                <>
                                    <span className="text-gray-200">|</span>
                                    <span>Oleh <strong className="text-gray-700 font-semibold">{news.author}</strong></span>
                                </>
                            )}

                            {/* Share button */}
                            <button
                                onClick={handleShare}
                                className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/5 transition"
                            >
                                <FiShare2 className="w-3.5 h-3.5" />
                                Bagikan
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex gap-1 mt-5 mb-6">
                            <div className="h-1 w-12 bg-primary rounded-full" />
                            <div className="h-1 flex-1 bg-gray-100 rounded-full" />
                        </div>

                        {/* Article body */}
                        <div
                            className="prose max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-headings:text-black prose-headings:font-bold prose-a:text-primary prose-img:rounded-2xl prose-img:shadow-md text-justify"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />

                        {/* Tag Kategori */}
                        {news.category && (
                            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                                <Link
                                    href={`/category/${news.category.slug}`}
                                    className="text-xs font-semibold text-secondary bg-smoky hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-full transition"
                                >
                                    #{news.category.name}
                                </Link>
                                {news.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Share CTA */}
                        <div className="mt-8 p-5 bg-smoky rounded-2xl flex items-center justify-between gap-4 flex-wrap">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Suka artikel ini?</p>
                                <p className="text-xs text-gray-500 mt-0.5">Bagikan ke teman-temanmu!</p>
                            </div>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition shrink-0"
                            >
                                <FiShare2 className="w-4 h-4" />
                                Bagikan
                            </button>
                        </div>
                    </article>

                    {/* ── SIDEBAR ── */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-[130px] space-y-5">

                            {/* Related news */}
                            {relatedNews.length > 0 && (
                                <div className="bg-white rounded-3xl border border-gray-100 p-5">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                                        <div className="w-1 h-4 bg-primary rounded-full" />
                                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                            Berita Terkait
                                        </h2>
                                    </div>
                                    <div className="flex flex-col divide-y divide-gray-50">
                                        {relatedNews.map((item) => (
                                            <div key={item.id} className="py-1 first:pt-0 last:pb-0">
                                                <NewsCardCompact
                                                    title={item.title}
                                                    category={item.category?.name}
                                                    image={`${storageUrl}/${item.cover}`}
                                                    date={item.published_at}
                                                    href={`/${item.slug}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href="/"
                                        className="mt-4 block text-center text-xs font-bold text-primary hover:underline"
                                    >
                                        Lihat semua berita →
                                    </Link>
                                </div>
                            )}

                            {/* Categories box */}
                            <div className="bg-white rounded-3xl border border-gray-100 p-5">
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                        Kategori
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <Link
                                            key={cat.id}
                                            href={`/category/${cat.slug}`}
                                            className="text-xs font-semibold text-gray-600 bg-smoky hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default ModuleNewsDetailPage
