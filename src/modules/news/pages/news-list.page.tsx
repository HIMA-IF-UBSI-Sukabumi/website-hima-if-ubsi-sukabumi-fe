'use client'

import {useState, useMemo, useCallback} from 'react'
import {useQuery, useInfiniteQuery} from '@tanstack/react-query'
import useAxios from '@/core/hooks/use-axios'
import {newsService, FeaturedNews} from '@/modules/news/services/api/news.service'
import {formatTimestamp, getStorageUrl} from '@/lib/utils'
import NewsNavbar from '@/modules/news/components/NewsNavbar'
import NewsCard from '@/modules/news/components/NewsCard'
import NewsCardCompact from '@/modules/news/components/NewsCardCompact'
import {FiRefreshCw, FiSearch, FiInbox, FiTrendingUp, FiStar, FiArrowRight, FiGrid} from 'react-icons/fi'
import Link from 'next/link'

// ── Empty state inline (untuk section yang belum ada data) ──
const SectionEmpty = ({message}: {message: string}) => (
    <div className="flex items-center justify-center gap-2 py-8 px-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <FiInbox className="w-4 h-4 text-gray-300 shrink-0"/>
        <p className="text-sm text-gray-400">{message}</p>
    </div>
)

const ModuleNewsListPage = () => {
    const axios = useAxios()
    const storageUrl = getStorageUrl()

    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    // ── FEATURED NEWS ──
    const {data: featuredData, isLoading: featuredLoading} = useQuery({
        queryKey: ['news-featured'],
        queryFn: async () => await newsService.findFeatured(axios),
        staleTime: 5 * 60 * 1000,
    })

    // ── POPULAR NEWS ──
    const {data: popularData, isLoading: popularLoading} = useQuery({
        queryKey: ['news-popular'],
        queryFn: async () => await newsService.findPopular(axios),
        staleTime: 5 * 60 * 1000,
    })

    // ── CATEGORIES ──
    const {data: categoriesData, isLoading: categoriesLoading} = useQuery({
        queryKey: ['news-categories'],
        queryFn: async () => await newsService.findCategories(axios),
        staleTime: 10 * 60 * 1000,
    })

    // ── ALL NEWS (cursor pagination) ──
    const {
        data,
        isLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['news-list', searchQuery, activeCategory],
        queryFn: async ({pageParam}) =>
            await newsService.findAll(
                axios,
                null,
                searchQuery || undefined,
                activeCategory || undefined,
                undefined,
                pageParam ? String(pageParam) : undefined,
            ),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) =>
            lastPage.next_cursor ? String(lastPage.next_cursor) : undefined,
    })

    const allNews = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])

    const featuredNewsList: FeaturedNews[] = featuredData?.news ?? []
    const popularNewsList: FeaturedNews[] = popularData?.news ?? []
    const categoriesList = categoriesData?.categories ?? []

    // Resolve nama kategori aktif dari data API
    const activeCategoryName = activeCategory
        ? categoriesList.find(c => c.slug === activeCategory)?.name ?? activeCategory
        : null

    // hero = first featured
    const heroNews = featuredNewsList[0] ?? null
    const heroSidebarNews = featuredNewsList.slice(1, 5)

    const handleCategoryChange = useCallback((cat: string | null) => {
        setActiveCategory(cat)
    }, [])

    const handleSearch = useCallback((q: string) => {
        setSearchQuery(q)
    }, [])

    const isFiltering = !!(searchQuery || activeCategory)

    // ── LOADING SKELETON ──
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NewsNavbar/>
                <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-96 bg-gray-200 rounded-3xl"/>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded-2xl"/>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded-2xl"/>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // ── ERROR STATE ──
    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NewsNavbar/>
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-4">
                        <FiRefreshCw className="w-8 h-8 text-red-400"/>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal memuat berita</h2>
                    <p className="text-gray-500 mb-6">Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
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

    return (
        <div className="min-h-screen bg-gray-50/50">
            <NewsNavbar
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                activeCategory={activeCategory}
            />

            <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-12">

                {/* ── HERO FEATURED ── */}
                {!isFiltering && (
                    <section>
                        <div className="flex items-center gap-2 mb-5">
                            <FiStar className="w-4 h-4 text-primary"/>
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Berita Unggulan</h2>
                        </div>

                        {featuredLoading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-pulse">
                                <div className="lg:col-span-2 h-80 bg-gray-200 rounded-3xl"/>
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-2xl"/>)}
                                </div>
                            </div>
                        ) : heroNews ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
                                <div className="lg:col-span-2">
                                    <NewsCard
                                        featured
                                        title={heroNews.title}
                                        image={`${storageUrl}/${heroNews.cover}`}
                                        date={formatTimestamp(heroNews.published_at)}
                                        category={heroNews.category?.name}
                                        href={`/${heroNews.slug}`}
                                    />
                                </div>
                                <div className="lg:col-span-1 flex flex-col">
                                    <div className="bg-white rounded-3xl border border-gray-100 p-4 flex-1">
                                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                                            <div className="w-1 h-4 bg-primary rounded-full"/>
                                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                                Featured Lainnya
                                            </h2>
                                        </div>
                                        {heroSidebarNews.length > 0 ? (
                                            <div className="flex flex-col divide-y divide-gray-50">
                                                {heroSidebarNews.map((item, i) => (
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
                                        ) : (
                                            <p className="text-xs text-gray-400 text-center py-4">
                                                Belum ada berita unggulan lainnya
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <SectionEmpty message="Belum ada berita unggulan saat ini"/>
                        )}
                    </section>
                )}

                {/* ── POPULAR NEWS ── */}
                {!isFiltering && (
                    <section>
                        <div className="flex items-center gap-2 mb-5">
                            <FiTrendingUp className="w-4 h-4 text-primary"/>
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                Paling Banyak Dibaca
                            </h2>
                        </div>

                        {popularLoading ? (
                            <div className="grid grid-cols-5 gap-4 animate-pulse">
                                {[...Array(5)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl"/>)}
                            </div>
                        ) : popularNewsList.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {popularNewsList.slice(0, 5).map((item, i) => (
                                    <Link
                                        key={item.id}
                                        href={`/${item.slug}`}
                                        className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                                    >
                                        <div className="relative overflow-hidden h-36">
                                            <img
                                                src={`${storageUrl}/${item.cover}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                            <span className="absolute top-2 left-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow">
                                                {i + 1}
                                            </span>
                                            {item.category?.name && (
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full">
                                                    {item.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-3 flex-1">
                                            <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition">
                                                {item.title}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1.5">{formatTimestamp(item.published_at)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <SectionEmpty message="Belum ada data berita populer"/>
                        )}
                    </section>
                )}

                {/* ── CATEGORIES QUICK NAV ── */}
                {!isFiltering && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FiGrid className="w-4 h-4 text-primary"/>
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Jelajah Kategori</h2>
                        </div>

                        {categoriesLoading ? (
                            <div className="flex gap-2 animate-pulse">
                                {[...Array(5)].map((_, i) => <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"/>)}
                            </div>
                        ) : categoriesList.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {categoriesList.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        className="group flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-gray-100 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 text-sm font-semibold text-gray-700 shadow-sm"
                                    >
                                        {cat.name}
                                        {cat.published_news_count !== undefined && (
                                            <span className="text-xs text-gray-400 group-hover:text-white/70 transition">
                                                {cat.published_news_count}
                                            </span>
                                        )}
                                        <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition"/>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <SectionEmpty message="Belum ada kategori tersedia"/>
                        )}
                    </section>
                )}

                {/* ── ALL NEWS ── */}
                <section>
                    <div className="flex items-center justify-between mb-5 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary rounded-full"/>
                            <h2 className="font-black text-gray-900">
                                {searchQuery
                                    ? `Hasil Pencarian "${searchQuery}"`
                                    : activeCategoryName
                                        ? `Kategori: ${activeCategoryName}`
                                        : 'Semua Berita'
                                }
                            </h2>
                            <span className="text-xs text-gray-400 font-medium">
                                ({allNews.length} dimuat)
                            </span>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-100 focus-within:border-primary/40 transition">
                            <FiSearch className="w-4 h-4 text-gray-400"/>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari berita..."
                                className="text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400 w-40"
                            />
                        </div>
                    </div>

                    {allNews.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-smoky mb-4">
                                <FiInbox className="w-7 h-7 text-gray-400"/>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Tidak ada berita ditemukan</h3>
                            <p className="text-sm text-gray-500">
                                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Belum ada berita di kategori ini'}
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setActiveCategory(null)
                                }}
                                className="mt-5 px-5 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition"
                            >
                                Tampilkan Semua
                            </button>
                        </div>
                    )}

                    {allNews.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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

                    {hasNextPage && (
                        <div className="flex justify-center mt-10">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md text-sm disabled:opacity-50"
                            >
                                {isFetchingNextPage ? 'Memuat...' : 'Muat Lebih Banyak'}
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default ModuleNewsListPage
