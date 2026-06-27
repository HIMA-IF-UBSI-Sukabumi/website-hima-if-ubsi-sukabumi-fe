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
