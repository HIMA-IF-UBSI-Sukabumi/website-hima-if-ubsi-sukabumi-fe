'use client'

import Image from "next/image"
import Link from "next/link"
import {clsx} from "clsx"
import {usePathname} from "next/navigation"
import {HiUserCircle, HiBars3, HiXMark} from "react-icons/hi2"
import {useState} from "react"

type Menu = {
    label: string
    href: string
}

const menus: Menu[] = [
    {label: 'Beranda', href: '/'},
    {label: 'Tentang', href: '/about'},
    {label: 'Kegiatan', href: '/activities'},
    {label: 'Berita', href: '/news'},
]

const Navbar = () => {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-[95%] max-w-5xl">
            <nav
                className="flex items-center justify-between rounded-full bg-white/90 px-6 py-3 shadow-lg backdrop-blur-md">

                <div className="flex items-center gap-3">
                    <img src="/assets/logo.webp" className={'w-16 h-16'} alt="Logo HIMA-IF"/>
                    <div className="leading-tight hidden sm:block">
                        <p className="text-lg font-extrabold">HIMA-IF</p>
                        <p className="text-sm text-gray-500">UBSI PSDKU Sukabumi</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    {menus.map(menu => (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={clsx(
                                'rounded-full px-4 py-2 text-sm transition',
                                pathname === menu.href
                                    ? 'bg-gray-300 font-medium'
                                    : 'font-medium hover:bg-gray-300'
                            )}
                        >
                            {menu.label}
                        </Link>
                    ))}

                    {/*<a*/}
                    {/*    href="https://dslr-master.linkbee.id"*/}
                    {/*    target="_blank"*/}
                    {/*    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"*/}
                    {/*>*/}
                    {/*    <HiUserCircle className="h-5 w-5"/>*/}
                    {/*    Masuk*/}
                    {/*</a>*/}
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden rounded-full p-2 hover:bg-gray-100"
                >
                    {open ? <HiXMark className="h-6 w-6"/> : <HiBars3 className="h-6 w-6"/>}
                </button>
            </nav>

            {open && (
                <div className="mt-3 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-md md:hidden">
                    <div className="flex flex-col gap-2">
                        {menus.map(menu => (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                onClick={() => setOpen(false)}
                                className={clsx(
                                    'rounded-xl px-4 py-2 text-sm transition',
                                    pathname === menu.href
                                        ? 'bg-gray-200 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                )}
                            >
                                {menu.label}
                            </Link>
                        ))}

                        {/*<a*/}
                        {/*  href="https://dslr-master.linkbee.id"*/}
                        {/*  target="_blank"*/}
                        {/*  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"*/}
                        {/*>*/}
                        {/*  <HiUserCircle className="h-5 w-5" />*/}
                        {/*  Masuk*/}
                        {/*</a>*/}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar
