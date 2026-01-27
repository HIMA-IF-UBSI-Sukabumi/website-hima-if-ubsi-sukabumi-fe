'use client';

import {HiOutlineEnvelope} from "react-icons/hi2";
import {FaInstagram} from "react-icons/fa6";
import {menus} from "@/modules/portal/components/Navbar";
import Link from "next/link";

const Footer = () => {
    return (
        <footer
            className="w-full bg-primary rounded-t-[56px] sm:rounded-t-[72px] md:rounded-t-[100px] lg:rounded-t-[120px]">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:py-14 md:py-16 flex flex-col items-center text-white">
                <div className="flex items-center gap-3 sm:gap-4">
                    <img
                        src="/assets/logo-himaif.webp" alt="HIMA-IF"
                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 pointer-events-none"
                    />
                    <div className="flex flex-col leading-tight">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrablack tracking-wide bg-linear-to-b from-white to-black/10 bg-clip-text text-transparent">HIMA–IF</h2>
                        <p className="text-sm sm:text-base md:text-xl tracking-wide opacity-90">UBSI PSDKU Sukabumi</p>
                    </div>
                </div>
                <nav
                    className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 sm:gap-x-12 text-sm sm:text-base opacity-90">
                    {menus.map((menu, i) => (
                        <Link
                            key={i}
                            href={menu.href}
                            className="hover:underline transition font-semibold">{menu.label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-6 flex gap-4">
                    <a className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"><FaInstagram
                        className="w-6 h-6 sm:w-7 sm:h-7"/></a>
                    <a className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"><HiOutlineEnvelope
                        className="w-6 h-6 sm:w-7 sm:h-7"/></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
