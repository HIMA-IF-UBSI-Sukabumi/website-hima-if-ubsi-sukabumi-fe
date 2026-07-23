import { getNewsUrl } from '@/lib/utils'
import ModuleNewsListPage from '@/modules/news/pages/news-list.page'
import {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const siteUrl = getNewsUrl()
    return {
        title: 'HIMA-IF News – Portal Berita Resmi HIMA-IF UBSI PSDKU Sukabumi',
        description: 'Berita terkini seputar akademik, kegiatan, dan prestasi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.',
        keywords: [
            'berita HIMA-IF', 'berita mahasiswa informatika Sukabumi', 'berita UBSI Sukabumi',
            'portal berita kampus', 'hima informatika ubsi', 'kegiatan mahasiswa informatika',
        ],
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
        alternates: {
            canonical: siteUrl,
        },
        openGraph: {
            title: 'HIMA-IF News – Portal Berita Resmi HIMA-IF UBSI PSDKU Sukabumi',
            description: 'Berita terkini seputar akademik, kegiatan, dan prestasi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.',
            url: siteUrl,
            type: 'website',
            images: [
                {
                    url: '/favicon.ico',
                    width: 1200,
                    height: 630,
                    alt: 'HIMA-IF News',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'HIMA-IF News – Portal Berita Resmi',
            description: 'Berita terkini seputar akademik, kegiatan, dan prestasi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.',
        },
    }
}

const NewsHubPage = () => {
    return <ModuleNewsListPage/>
}

export default NewsHubPage
