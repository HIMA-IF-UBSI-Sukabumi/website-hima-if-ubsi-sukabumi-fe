import type {Metadata} from 'next'
import NewsFooter from '@/modules/news/components/NewsFooter'

export const metadata: Metadata = {
    title: {
        default: 'HIMA-IF News – Portal Berita Resmi',
        template: '%s | HIMA-IF News',
    },
    description: 'Portal berita resmi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi. Informasi terkini seputar akademik, organisasi, dan kegiatan kampus.',
    keywords: ['HIMA-IF', 'UBSI', 'Sukabumi', 'berita', 'informatika', 'mahasiswa'],
    openGraph: {
        siteName: 'HIMA-IF News',
        locale: 'id_ID',
    },
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
