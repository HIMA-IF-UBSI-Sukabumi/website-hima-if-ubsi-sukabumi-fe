'use client'

import {useState, useMemo} from 'react'
import {useQuery} from '@tanstack/react-query'
import useAxios from '@/core/hooks/use-axios'
import {newsService, NEWS_CATEGORIES} from '@/modules/news/services/api/news.service'
import {formatTimestamp, getStorageUrl} from '@/lib/utils'
import NewsNavbar from '@/modules/news/components/NewsNavbar'
import NewsCard from '@/modules/news/components/NewsCard'
import NewsCardCompact from '@/modules/news/components/NewsCardCompact'
import {FiRefreshCw, FiSearch, FiInbox} from 'react-icons/fi'

const ITEMS_PER_PAGE = 9

const ModuleNewsListPage = () => {
    const axios = useAxios()
    const storageUrl = getStorageUrl()

    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [page, setPage] = useState(1)

    const {data, isLoading, isError, refetch} = useQuery({
        queryKey: ['news-list'],
        queryFn: async () => await newsService.findAll(axios, null),
    })

    const allNews = data?.data ?? []

    // Client-side filter by search + category (dummy filter since API doesn't support category)
    const filteredNews = useMemo(() => {
        let result = allNews

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(item =>
                item.news.title.toLowerCase().includes(q) ||
                item.news.content.toLowerCase().includes(q)
            )
        }

        if (activeCategory) {
            result = result.filter(item =>
                item.news.category?.some(c =>
                    c.toLowerCase() === activeCategory.toLowerCase()
                )
            )
        }

        return result
    }, [allNews, searchQuery, activeCategory])

    // Pagination
    const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE)
    const paginatedNews = filteredNews.slice(0, page * ITEMS_PER_PAGE)

    const featuredNews = allNews[0] ?? null
    const sidebarNews = allNews.slice(1, 6)

    // Loading skeleton
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

    // Error state
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
                onSearch={setSearchQuery}
                onCategoryChange={(cat) => {
                    setActiveCategory(cat)
                    setPage(1)
                }}
                activeCategory={activeCategory}
            />

            <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">

                {/* ── HERO SECTION (only when no search/filter) ── */}
                {!searchQuery && !activeCategory && featuredNews && (
                    <section className="mb-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">

                            {/* Featured card */}
                            <div className="lg:col-span-2">
                                <NewsCard
                                    featured
                                    title={featuredNews.news.title}
                                    description={featuredNews.news.content}
                                    image={`${storageUrl}/${featuredNews.news.cover}`}
                                    date={formatTimestamp(featuredNews.news.created_at)}
                                    category={featuredNews.news.category?.[0]}
                                    href={`/${featuredNews.news.slug}`}
                                />
                            </div>

                            {/* Sidebar: trending */}
                            <div className="lg:col-span-1 flex flex-col">
                                <div className="bg-white rounded-3xl border border-gray-100 p-4 flex-1">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                                        <div className="w-1 h-4 bg-primary rounded-full"/>
                                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                            Berita Lainnya
                                        </h2>
                                    </div>
                                    <div className="flex flex-col divide-y divide-gray-50">
                                        {sidebarNews.map((item, i) => (
                                            <div key={item.news.id} className="py-1 first:pt-0 last:pb-0">
                                                <NewsCardCompact
                                                    title={item.news.title}
                                                    category={item.news.category?.[0]}
                                                    image={`${storageUrl}/${item.news.cover}`}
                                                    date={formatTimestamp(item.news.created_at)}
                                                    href={`/${item.news.slug}`}
                                                    index={i}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── DIVIDER + SEARCH RESULT HEADER ── */}
                <div className="flex items-center justify-between mb-5 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-primary rounded-full"/>
                        <h2 className="font-black text-gray-900">
                            {searchQuery
                                ? `Hasil Pencarian "${searchQuery}"`
                                : activeCategory
                                    ? `Kategori: ${NEWS_CATEGORIES.find(c => c.value === activeCategory)?.label}`
                                    : 'Semua Berita'
                            }
                        </h2>
                        <span className="text-xs text-gray-400 font-medium">
                            ({filteredNews.length} berita)
                        </span>
                    </div>

                    {/* Inline search for desktop */}
                    <div className="hidden sm:flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-100 focus-within:border-primary/40 transition">
                        <FiSearch className="w-4 h-4 text-gray-400"/>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Cari berita..."
                            className="text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400 w-40"
                        />
                    </div>
                </div>

                {/* ── EMPTY STATE ── */}
                {filteredNews.length === 0 && (
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
                                setPage(1)
                            }}
                            className="mt-5 px-5 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition"
                        >
                            Tampilkan Semua
                        </button>
                    </div>
                )}

                {/* ── NEWS GRID ── */}
                {paginatedNews.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {paginatedNews.map((item) => (
                            <NewsCard
                                key={item.news.id}
                                title={item.news.title}
                                description={item.news.content}
                                image={`${storageUrl}/${item.news.cover}`}
                                date={formatTimestamp(item.news.created_at)}
                                category={item.news.category?.[0]}
                                href={`/${item.news.slug}`}
                            />
                        ))}
                    </div>
                )}

                {/* ── LOAD MORE ── */}
                {page < totalPages && (
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={() => setPage(p => p + 1)}
                            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                        >
                            Muat Lebih Banyak
                            <span className="ml-2 text-xs text-gray-400">
                                ({filteredNews.length - page * ITEMS_PER_PAGE} berita lagi)
                            </span>
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}

export default ModuleNewsListPage
