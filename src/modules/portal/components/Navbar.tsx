'use client'

import {Image} from "next/dist/client/image-component";
import Link from "next/dist/client/link";
import {clsx} from "clsx";
import {usePathname} from "next/dist/client/components/navigation";
import {HiUserCircle} from "react-icons/hi2";

type Menu = {
    label: string,
    href: string,
}

const menus: Menu[] = [
    {
        label: 'Beranda',
        href: '/',
    },
    {
        label: 'Tentang',
        href: '/about',
    },
    {
        label: 'Kegiatan',
        href: '/activities',
    },
    {
        label: 'berita',
        href: '/news',
    }
]

const Navbar = () => {
    const pathname = usePathname();

    return (
        <div className={'fixed top-6 left-1/2 z-50 -translate-x-1/2'}>
            <nav
                className={'flex items-center justify-between gap-8 rounded-full bg-white/90 px-8 py-3 shadow-lg backdrop-blur-md'}>
                <div className={'flex items-center gap-3'}>
                    <Image src={'/assets/logo.webp'} alt={'Logo HIMA-IF'} width={52} height={52}/>
                    <div className={'leading-tight'}>
                        <p className="text-sm font-bold">HIMA-IF</p>
                        <p className="text-xs text-gray-500">UBSI PSDKU Sukabumi</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {menus.map((menu) => (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className={clsx(
                                    'rounded-full px-4 py-2 text-sm transition',
                                    pathname === menu.href
                                        ? 'bg-gray-200 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                )}
                            >
                                {menu.label}
                            </Link>
                        ))}
                    </div>

                    <a
                        href="https://dslr-master.linkbee.id"
                        target={'_blank'}
                        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        <HiUserCircle className="h-5 w-5"/>
                        Masuk
                    </a>
                </div>
            </nav>
        </div>
    )
}

export default Navbar