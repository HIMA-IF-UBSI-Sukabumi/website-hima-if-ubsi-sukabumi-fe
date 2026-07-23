import type {Metadata} from 'next'
import NewsFooter from '@/modules/news/components/NewsFooter'

import { getNewsUrl } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
    const siteUrl = getNewsUrl()
    return {
        metadataBase: (() => {
            try { return new URL(siteUrl) } catch { return new URL('https://news.himaifubsismi.or.id') }
        })(),
        title: {
            default: 'HIMA-IF News – Portal Berita Resmi HIMA-IF UBSI PSDKU Sukabumi',
            template: '%s | HIMA-IF News',
        },
        description: 'Portal berita resmi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi. Informasi terkini seputar akademik, organisasi, dan kegiatan kampus.',
        keywords: [
            'HIMA-IF', 'UBSI', 'Sukabumi', 'berita', 'informatika', 'mahasiswa',
            'Himpunan Mahasiswa Informatika', 'UBSI PSDKU Sukabumi', 'berita kampus',
        ],
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-snippet': -1,
                'max-image-preview': 'large',
                'max-video-preview': -1,
            },
        },
        icons: [
            {
                url: '/favicon.ico',
                sizes: '16x16',
                type: 'image/x-icon',
            },
            {
                url: '/favicon.ico',
                sizes: '32x32',
                type: 'image/x-icon',
            },
            {
                url: '/favicon.ico',
                sizes: '48x48',
                type: 'image/x-icon',
            },
            {
                url: '/favicon.ico',
                sizes: '64x64',
                type: 'image/x-icon',
            },
            {
                url: '/favicon.ico',
                sizes: '96x96',
                type: 'image/x-icon',
            },
            {
                url: '/favicon.ico',
                sizes: '128x128',
                type: 'image/x-icon',
            },
            {
                url: '/favicon.ico',
                sizes: '192x192',
                type: 'image/x-icon',
            },
            {
                url: '/favicon.ico',
                sizes: '256x256',
                type: 'image/x-icon',
            },
            {
                url: '/favicon.ico',
                sizes: '512x512',
                type: 'image/x-icon',
            },
        ],
        openGraph: {
            siteName: 'HIMA-IF News',
            locale: 'id_ID',
            type: 'website',
            url: '/',
            images: [
                {
                    url: '/favicon.ico',
                    width: 1200,
                    height: 630,
                    alt: 'HIMA-IF News – Portal Berita Resmi HIMA-IF UBSI PSDKU Sukabumi',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@himaifubsi',
            title: 'HIMA-IF News – Portal Berita Resmi',
            description: 'Portal berita resmi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.',
        },
    }
}


export default function NewsHubLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50">
            <main className="flex-1">
                {children}
            </main>
            <NewsFooter/>
        </div>
    )
}
