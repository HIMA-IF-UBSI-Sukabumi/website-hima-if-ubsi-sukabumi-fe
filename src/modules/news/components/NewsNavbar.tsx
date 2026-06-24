'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { HiBars3, HiXMark, HiMagnifyingGlass, HiChevronDown } from 'react-icons/hi2'
import { FaInstagram } from 'react-icons/fa6'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { useQuery } from '@tanstack/react-query'
import useAxios from '@/core/hooks/use-axios'
import { newsService, Category } from '@/modules/news/services/api/news.service'

type NewsNavbarProps = {
    onSearch?: (query: string) => void
    onCategoryChange?: (category: string | null) => void
    activeCategory?: string | null
}

const TICKER_MESSAGES = [
    'Selamat datang di portal berita resmi HIMA-IF UBSI PSDKU Sukabumi',
    'Ikuti terus update kegiatan dan prestasi HIMA-IF',
    'Informasi terkini seputar dunia informatika dan akademik',
]

const NewsNavbar = ({ onSearch, onCategoryChange, activeCategory }: NewsNavbarProps) => {
    const axios = useAxios()
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [tickerIndex, setTickerIndex] = useState(0)
    const [scrolled, setScrolled] = useState(false)
    const [mobileCatOpen, setMobileCatOpen] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)

    // ── Fetch categories dari API ──
    const { data: categoriesData } = useQuery({
        queryKey: ['news-categories'],
        queryFn: async () => await newsService.findCategories(axios),
        staleTime: 10 * 60 * 1000,
    })
    const categories: Category[] = categoriesData?.categories ?? []

    // Deteksi active category: dari prop (news-list filter) ATAU dari URL path (/category/[slug])
    const pathCategorySlug = pathname?.startsWith('/category/')
        ? pathname.replace('/category/', '').split('/')[0]
        : null
    const effectiveActiveCategory = activeCategory ?? pathCategorySlug

    const now = new Date()
    const dateStr = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    // Breaking news ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    // Scroll shadow
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [])

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => searchRef.current?.focus(), 100)
        }
    }, [searchOpen])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch?.(searchQuery)
        setSearchOpen(false)
    }

    const handleCategory = (value: string | null) => {
        onCategoryChange?.(value)
        setMobileOpen(false)
        setMobileCatOpen(false)
    }

    const activeCategoryName = effectiveActiveCategory
        ? categories.find(c => c.slug === effectiveActiveCategory)?.name ?? effectiveActiveCategory
        : 'Semua'

    const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    return (
        <header className="w-full sticky top-0 z-50">
            {/* Breaking News Ticker */}
            <div className="bg-primary text-white text-xs py-1.5 px-4 hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span
                        className="bg-white text-primary font-extrabold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
                        Breaking
                    </span>
                    <div className="overflow-hidden flex-1">
                        <p
                            key={tickerIndex}
                            className="truncate animate-[fadeIn_0.5s_ease] font-medium"
                            style={{ animation: 'fadeIn 0.5s ease' }}
                        >
                            {TICKER_MESSAGES[tickerIndex]}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    <a href={`${mainSiteUrl}`} className="hover:underline opacity-80 transition">
                        ← Kembali ke Portal
                    </a>
                    <span className="opacity-40">|</span>
                    <span className="opacity-70">{dateStr}</span>
                </div>
            </div>

            {/* Main Header */}
            <div className={`bg-white border-b border-gray-100 transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="relative">
                            <img
                                src="/assets/logo-himaif.webp"
                                alt="HIMA-IF"
                                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                            />
                        </div>
                        <div className="leading-tight">
                            <div className="flex items-baseline gap-1.5">
                                <span
                                    className="text-lg sm:text-xl font-black text-primary tracking-tight group-hover:opacity-80 transition">
                                    HIMA<span className="text-secondary">-IF</span>
                                </span>
                                <span
                                    className="text-xs font-extrabold bg-primary text-white px-1.5 py-0.5 rounded tracking-wider uppercase">
                                    News
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">UBSI PSDKU Sukabumi</p>
                        </div>
                    </Link>

                    {/* Desktop Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex flex-1 max-w-md mx-auto"
                    >
                        <div
                            className="flex items-center w-full bg-smoky rounded-full px-4 py-2 gap-2 focus-within:ring-2 focus-within:ring-primary/30 transition">
                            <HiMagnifyingGlass className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari berita..."
                                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                            />
                        </div>
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <a
                            href="https://www.instagram.com/himaif.ubsismi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-smoky transition text-gray-500 hover:text-primary"
                        >
                            <FaInstagram className="w-4 h-4" />
                        </a>
                        <a
                            href="mailto:himaif.smi@bsi.ac.id"
                            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-smoky transition text-gray-500 hover:text-primary"
                        >
                            <HiOutlineEnvelope className="w-4 h-4" />
                        </a>

                        {/* Mobile search toggle */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-smoky transition"
                        >
                            <HiMagnifyingGlass className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-smoky transition"
                        >
                            {mobileOpen
                                ? <HiXMark className="w-5 h-5 text-gray-600" />
                                : <HiBars3 className="w-5 h-5 text-gray-600" />
                            }
                        </button>
                    </div>
                </div>

                {/* Mobile Search Dropdown */}
                {searchOpen && (
                    <div className="md:hidden px-4 pb-3">
                        <form onSubmit={handleSearch}>
                            <div
                                className="flex items-center w-full bg-smoky rounded-full px-4 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-primary/30 transition">
                                <HiMagnifyingGlass className="w-4 h-4 text-gray-400 shrink-0" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari berita..."
                                    className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                                />
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Category Navigation Bar */}
            <nav className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Desktop categories */}
                    <div className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
                        {/* "Semua" button */}
                        <Link
                            href={'/'}
                            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition border-b-2 ${effectiveActiveCategory === null
                                ? 'text-primary border-primary'
                                : 'text-gray-500 border-transparent hover:text-primary hover:border-primary/40'
                                }`}
                        >
                            Semua
                        </Link>

                        {/* Dynamic categories dari API */}
                        {categories.map((cat) => {
                            const isActive = effectiveActiveCategory === cat.slug
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition border-b-2 ${isActive
                                        ? 'text-primary border-primary'
                                        : 'text-gray-500 border-transparent hover:text-primary hover:border-primary/40'
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Mobile categories — collapsed dropdown trigger */}
                    <div className="md:hidden flex items-center justify-between py-2">
                        <button
                            onClick={() => setMobileCatOpen(!mobileCatOpen)}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700 py-1"
                        >
                            <span>{activeCategoryName}</span>
                            <HiChevronDown
                                className={`w-4 h-4 transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <span className="text-xs text-gray-400">Kategori</span>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Menu</p>
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-smoky transition text-gray-700"
                        >
                            🏠 Beranda Berita
                        </Link>
                        <a
                            href={mainSiteUrl}
                            className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-smoky transition text-gray-700"
                        >
                            ← Kembali ke Portal HIMA-IF
                        </a>
                        <div className="border-t border-gray-100 mt-2 pt-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Kategori</p>
                            {/* Semua */}
                            <Link
                                href={'/'}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${effectiveActiveCategory === null
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 hover:bg-smoky'
                                    }`}
                            >
                                Semua
                            </Link>
                            {/* Dynamic */}
                            {categories.map((cat) => {
                                const isActive = effectiveActiveCategory === cat.slug
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${isActive
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:bg-smoky'
                                            }`}
                                    >
                                        {cat.name}
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="flex gap-3 px-4 mt-3">
                            <a
                                href="https://www.instagram.com/himaif.ubsismi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition"
                            >
                                <FaInstagram className="w-4 h-4" />
                                Instagram
                            </a>
                            <a
                                href="mailto:himaif.smi@bsi.ac.id"
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition"
                            >
                                <HiOutlineEnvelope className="w-4 h-4" />
                                Email
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Category Dropdown */}
            {mobileCatOpen && !mobileOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 shadow-md">
                    <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-3 gap-1">
                        {/* Semua */}
                        <button
                            onClick={() => handleCategory(null)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition ${effectiveActiveCategory === null
                                ? 'bg-primary text-white'
                                : 'bg-smoky text-gray-600 hover:bg-primary/10 hover:text-primary'
                                }`}
                        >
                            Semua
                        </button>
                        {/* Dynamic */}
                        {categories.map((cat) => {
                            const isActive = effectiveActiveCategory === cat.slug
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition ${isActive
                                        ? 'bg-primary text-white'
                                        : 'bg-smoky text-gray-600 hover:bg-primary/10 hover:text-primary'
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    )
}

export default NewsNavbar
