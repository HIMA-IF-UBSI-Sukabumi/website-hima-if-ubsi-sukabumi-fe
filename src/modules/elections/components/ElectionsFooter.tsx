'use client'

import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { getNewsUrl, getNglUrl } from "@/lib/utils";

const ElectionsFooter = () => {
    const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    return (
        <footer className="bg-primary text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src="/assets/logo-himaif.webp"
                                alt="HIMA-IF"
                                className="w-12 h-12 object-contain"
                            />
                            <div className="leading-tight">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-black tracking-tight">
                                        HIMA<span className="opacity-70">-IF</span>
                                    </span>
                                    <span className="text-[10px] font-extrabold bg-white text-primary px-1.5 py-0.5 rounded tracking-wider uppercase">
                                        SuaraMu
                                    </span>
                                </div>
                                <p className="text-xs text-white/60 mt-0.5">UBSI PSDKU Sukabumi</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/75 leading-relaxed max-w-xs">
                            Platform E-Voting resmi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.
                            Jujur, rahasia, dan transparan.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                            Navigasi
                        </h3>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li>
                                <Link href="/" className="hover:text-white transition">
                                    Beranda SuaraMu
                                </Link>
                            </li>
                            <li>
                                <a href={mainSiteUrl} className="hover:text-white transition">
                                    Portal Utama HIMA-IF
                                </a>
                            </li>
                            <li>
                                <a href={getNewsUrl()} className="hover:text-white transition">
                                    HIMA-IF News
                                </a>
                            </li>
                            <li>
                                <a href={getNglUrl()} className="hover:text-white transition">
                                    HIMA-IF NGL
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                            Kontak & Sosial Media
                        </h3>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.instagram.com/himaif.ubsismi"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram HIMA-IF"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                            >
                                <FaInstagram className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:himaif.ubsismi@gmail.com"
                                aria-label="Email HIMA-IF"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                            >
                                <HiOutlineEnvelope className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/15 mt-8 pt-6 text-center text-xs text-white/60">
                    &copy; {new Date().getFullYear()} HIMA-IF UBSI PSDKU Sukabumi. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default ElectionsFooter;
