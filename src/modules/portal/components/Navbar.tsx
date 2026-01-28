'use client'

import Link from "next/link"
import {usePathname} from "next/navigation"
import {HiUserCircle, HiBars3, HiXMark, HiArrowUp, HiArrowDown} from "react-icons/hi2"
import {useState} from "react"
import {cn} from "@/lib/utils";

type Menu = {
    label: string
    href: string,
    submenu?: Menu[]
}

export const menus: Menu[] = [
    {label: 'Beranda', href: '/'},
    {label: 'Tentang', href: '/about'},
    {
        label: 'Pengurus',
        href: '/',
        submenu: [
            {label: 'BPH', href: '/pengurus/bph'},
            {label: 'Divisi', href: '/pengurus/divisi'},
            {label: 'Anggota', href: '/pengurus/anggota'},
        ],
    },
    {label: 'Kegiatan', href: '/activities'},
    {label: 'Berita', href: '/news'},
]

const Navbar = () => {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [submenuOpen, setSubmenuOpen] = useState<string | null>(null)

    return (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-[95%] max-w-5xl">
            <nav
                className="flex items-center justify-between rounded-full bg-white/90 px-6 py-3 shadow-lg shadow-black backdrop-blur-md">

                <div className="flex items-center gap-3">
                    <img src="/assets/logo-himaif.webp" className={'w-16 h-16 pointer-events-none'} alt="Logo HIMA-IF"/>
                    <div className="leading-tight block">
                        <h1 className="text-xl font-extrablack text-black">HIMA-IF</h1>
                        <p className="text-sm text-black">UBSI PSDKU Sukabumi</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    {menus.map(menu => {
                        const isActive =
                            menu.href === '/'
                                ? pathname === '/'
                                : pathname.startsWith(menu.href)

                        const isSubActive = menu.submenu?.some(sub =>
                            pathname.startsWith(sub.href)
                        )

                        if (menu.submenu) {
                            return (
                                <div key={menu.label} className="relative group">
                                    <button
                                        className={cn(
                                            'rounded-full px-4 py-2 text-sm font-medium transition',
                                            isSubActive
                                                ? 'bg-smoky text-black font-bold'
                                                : 'hover:bg-gray-300'
                                        )}
                                    >
                                        {menu.label}
                                    </button>

                                    <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
                                        <div className="min-w-[180px] rounded-2xl bg-white p-2 shadow-lg">
                                            {menu.submenu.map(sub => {
                                                const subActive = pathname.startsWith(sub.href)
                                                return (
                                                    <Link
                                                        key={sub.href}
                                                        href={sub.href}
                                                        className={cn(
                                                            'block rounded-xl px-4 py-2 text-sm transition',
                                                            subActive
                                                                ? 'bg-smoky text-black font-bold'
                                                                : 'hover:bg-gray-100'
                                                        )}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className={cn(
                                    'rounded-full px-4 py-2 text-sm font-medium transition',
                                    isActive
                                        ? 'bg-smoky text-black font-bold'
                                        : 'hover:bg-gray-300'
                                )}
                            >
                                {menu.label}
                            </Link>
                        )
                    })}
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
                        {menus.map(menu => {
                            const isActive =
                                menu.href === '/'
                                    ? pathname === '/'
                                    : pathname.startsWith(menu.href)

                            const isSubActive = menu.submenu?.some(sub =>
                                pathname.startsWith(sub.href)
                            )

                            if (menu.submenu) {
                                return (
                                    <div key={menu.label} className="rounded-xl bg-gray-100">
                                        <button
                                            onClick={() =>
                                                setSubmenuOpen(
                                                    submenuOpen === menu.label ? null : menu.label
                                                )
                                            }
                                            className={cn(
                                                'flex w-full items-center justify-between px-4 py-2 text-sm font-medium transition',
                                                isSubActive && 'bg-smoky text-black font-bold rounded-xl'
                                            )}
                                        >
                                            {menu.label}
                                            <span
                                                className={cn(
                                                    'transition-transform',
                                                    submenuOpen === menu.label && 'rotate-180'
                                                )}
                                            >
                                                <HiArrowDown/>
                                            </span>
                                        </button>

                                        {submenuOpen === menu.label && (
                                            <div className="mt-1 flex flex-col gap-1 px-2 pb-2">
                                                {menu.submenu.map(sub => (
                                                    <Link
                                                        key={sub.href}
                                                        href={sub.href}
                                                        onClick={() => {
                                                            setOpen(false)
                                                            setSubmenuOpen(null)
                                                        }}
                                                        className={cn(
                                                            'rounded-lg px-4 py-2 text-sm transition',
                                                            pathname.startsWith(sub.href)
                                                                ? 'bg-smoky text-black font-bold'
                                                                : 'hover:bg-gray-200'
                                                        )}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            }

                            return (
                                <Link
                                    key={menu.href}
                                    href={menu.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'rounded-xl px-4 py-2 text-sm font-medium transition',
                                        isActive
                                            ? 'bg-smoky text-black font-bold'
                                            : 'hover:bg-gray-100'
                                    )}
                                >
                                    {menu.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar