'use client'

import Link from 'next/link'
import { FaInstagram } from 'react-icons/fa6'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { Category, NEWS_CATEGORIES, newsService } from '@/modules/news/services/api/news.service'
import useAxios from '@/core/hooks/use-axios'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

const NewsFooter = () => {
    const axios = useAxios()
    const pathname = usePathname()
    const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // ── Fetch categories dari API ──
    const { data: categoriesData } = useQuery({
        queryKey: ['news-categories'],
        queryFn: async () => await newsService.findCategories(axios),
        staleTime: 10 * 60 * 1000,
    })
    const categories: Category[] = categoriesData?.categories ?? []

    return (
        <footer className="bg-primary text-white mt-auto">
            {/* Top section */}
            <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/assets/logo-himaif.webp"
                                alt="HIMA-IF"
                                className="w-14 h-14 object-contain"
                            />
                            <div className="leading-tight">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black tracking-tight">HIMA<span className="opacity-70">-IF</span></span>
                                    <span className="text-xs font-extrabold bg-white text-primary px-1.5 py-0.5 rounded tracking-wider uppercase">
                                        News
                                    </span>
                                </div>
                                <p className="text-xs text-white/60 mt-0.5">UBSI PSDKU Sukabumi</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed max-w-xs">
                            Portal berita resmi Himpunan Mahasiswa Informatika
                            Universitas Bina Sarana Informatika PSDKU Sukabumi.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            <a
                                href="https://www.instagram.com/himaif.ubsismi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                            >
                                <FaInstagram className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:himaif.smi@bsi.ac.id"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                            >
                                <HiOutlineEnvelope className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-white/50 mb-4">
                            Kategori Berita
                        </h3>
                        <ul className="space-y-2.5">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/category/${cat.slug}`}
                                        className="text-sm text-white/75 hover:text-white transition font-medium flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition shrink-0" />
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-white/50 mb-4">
                            Tautan
                        </h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link href="/" className="text-sm text-white/75 hover:text-white transition font-medium flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition shrink-0" />
                                    Beranda Berita
                                </Link>
                            </li>
                            <li>
                                <a href={mainSiteUrl} className="text-sm text-white/75 hover:text-white transition font-medium flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition shrink-0" />
                                    Portal HIMA-IF
                                </a>
                            </li>
                            <li>
                                <a href={`${mainSiteUrl}/about`} className="text-sm text-white/75 hover:text-white transition font-medium flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition shrink-0" />
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a href={`${mainSiteUrl}/activity`} className="text-sm text-white/75 hover:text-white transition font-medium flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition shrink-0" />
                                    Kegiatan
                                </a>
                            </li>
                            <li>
                                <a href="mailto:himaif.smi@bsi.ac.id" className="text-sm text-white/75 hover:text-white transition font-medium flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition shrink-0" />
                                    Kirim Tulisan
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40 text-center">
                    <p>
                        © {new Date().getFullYear()} HIMA-IF UBSI PSDKU Sukabumi. Semua hak cipta dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default NewsFooter
