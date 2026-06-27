'use client'

import {useInfiniteQuery, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import useAxios from '@/core/hooks/use-axios'
import {newsService} from '@/modules/news/services/api/news.service'
import {formatTimestamp, getStorageUrl, getNewsUrl} from '@/lib/utils'
import NewsNavbar from '@/modules/news/components/NewsNavbar'
import NewsCard from '@/modules/news/components/NewsCard'
import NewsCardCompact from '@/modules/news/components/NewsCardCompact'
import Link from 'next/link'
import {FiArrowLeft, FiRefreshCw, FiInbox, FiGrid} from 'react-icons/fi'

type NewsCategoryPageProps = {
    categorySlug: string
}

const ModuleNewsCategoryPage = ({categorySlug}: NewsCategoryPageProps) => {
    const axios = useAxios()
    const storageUrl = getStorageUrl()

    // ── POPULAR (sidebar) ──
    const {data: popularData} = useQuery({
        queryKey: ['news-popular'],
        queryFn: async () => await newsService.findPopular(axios),
        staleTime: 5 * 60 * 1000,
    })
    const popularNews = popularData?.news ?? []

    // ── NEWS BY CATEGORY (cursor pagination) ──
    const {
        data,
        isLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['news-category', categorySlug],
        queryFn: async ({pageParam}) =>
            await newsService.findByCategory(axios, categorySlug, pageParam ? String(pageParam) : undefined),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) =>
            lastPage.data.next_cursor ? String(lastPage.data.next_cursor) : undefined,
    })

    const category = data?.pages[0]?.category ?? null
    const allNews = useMemo(() => data?.pages.flatMap(p => p.data.data) ?? [], [data])

    // ── LOADING ──
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NewsNavbar/>
                <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
                    <div className="h-8 w-64 bg-gray-200 rounded-full mb-8"/>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-64 bg-gray-200 rounded-2xl"/>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded-2xl"/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ── ERROR ──
    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NewsNavbar/>
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-4">
                        <FiRefreshCw className="w-8 h-8 text-red-400"/>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal memuat berita</h2>
                    <p className="text-gray-500 mb-6">Terjadi kesalahan. Silakan coba lagi.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        )
    }

    const jsonLdBreadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Beranda Berita',
                item: getNewsUrl(),
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Kategori',
                item: getNewsUrl('/category'),
            },
            ...(category ? [{
                '@type': 'ListItem',
                position: 3,
                name: category.name,
                item: getNewsUrl(`/category/${category.slug}`),
            }] : []),
        ],
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* ── JSON-LD Structured Data ── */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLdBreadcrumb)}}
            />

            <NewsNavbar/>

            <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">

                {/* ── BREADCRUMB ── */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-secondary hover:text-primary transition font-medium"
                    >
                        <FiArrowLeft className="w-4 h-4"/>
                        Beranda Berita
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-500">Kategori</span>
                    {category && (
                        <>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-900 font-semibold">{category.name}</span>
                        </>
                    )}
                </div>

                {/* ── CATEGORY HEADER ── */}
                {category && (
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <FiGrid className="w-5 h-5 text-primary"/>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{category.name}</h1>
                                {category.description && (
                                    <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
                                )}
                            </div>
                        </div>
                        {category.published_news_count !== undefined && (
                            <p className="text-xs text-gray-400 ml-13">
                                {category.published_news_count} artikel diterbitkan
                            </p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* ── MAIN: NEWS GRID ── */}
                    <div className="lg:col-span-2">

                        {/* Empty state */}
                        {allNews.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-smoky mb-4">
                                    <FiInbox className="w-7 h-7 text-gray-400"/>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Belum ada berita</h3>
                                <p className="text-sm text-gray-500">
                                    Belum ada berita di kategori ini.
                                </p>
                                <Link
                                    href="/"
                                    className="mt-5 inline-block px-5 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition"
                                >
                                    Lihat Semua Berita
                                </Link>
                            </div>
                        )}

                        {/* Grid */}
                        {allNews.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                {allNews.map((item) => (
                                    <NewsCard
                                        key={item.news.id}
                                        title={item.news.title}
                                        image={`${storageUrl}/${item.news.cover}`}
                                        date={formatTimestamp(item.news.created_at)}
                                        category={item.news.category?.name}
                                        href={`/${item.news.slug}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Load More */}
                        {hasNextPage && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md text-sm disabled:opacity-50"
                                >
                                    {isFetchingNextPage ? 'Memuat...' : 'Muat Lebih Banyak'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── SIDEBAR ── */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-[130px] space-y-5">

                            {/* Popular news */}
                            {popularNews.length > 0 && (
                                <div className="bg-white rounded-3xl border border-gray-100 p-5">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                                        <div className="w-1 h-4 bg-primary rounded-full"/>
                                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                            Paling Populer
                                        </h2>
                                    </div>
                                    <div className="flex flex-col divide-y divide-gray-50">
                                        {popularNews.slice(0, 5).map((item, i) => (
                                            <div key={item.id} className="py-1 first:pt-0 last:pb-0">
                                                <NewsCardCompact
                                                    title={item.title}
                                                    category={item.category?.name}
                                                    image={`${storageUrl}/${item.cover}`}
                                                    date={formatTimestamp(item.published_at)}
                                                    href={`/${item.slug}`}
                                                    index={i}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Back to all news */}
                            <Link
                                href="/"
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl text-sm font-semibold hover:bg-primary/90 transition"
                            >
                                <FiArrowLeft className="w-4 h-4"/>
                                Semua Berita
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default ModuleNewsCategoryPage
