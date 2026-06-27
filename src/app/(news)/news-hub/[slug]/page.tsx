import ModuleNewsDetailPage from '@/modules/news/pages/news-detail.page'
import {Metadata} from 'next'

type Props = {
    params: Promise<{slug: string}>
}

/**
 * Helper: strip HTML tags and truncate to maxLength characters.
 */
function stripHtml(html: string, maxLength = 160): string {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8080/storage'
    const siteUrl = process.env.NEXT_PUBLIC_NEWS_URL ?? 'http://news.localhost:3000'

    try {
        const res = await fetch(`${apiUrl}/news/${slug}`, {
            next: {revalidate: 60 * 60}, // revalidate every 1 hour
        })

        if (!res.ok) {
            return {
                title: 'Berita Tidak Ditemukan | HIMA-IF News',
                description: 'Artikel yang kamu cari tidak tersedia di HIMA-IF News.',
                robots: {index: false, follow: false},
            }
        }

        const json = await res.json()
        const news = json?.news

        if (!news) {
            return {title: 'HIMA-IF News', description: 'Portal berita HIMA-IF UBSI PSDKU Sukabumi.'}
        }

        const title = `${news.title} | HIMA-IF News`
        const description = news.content
            ? stripHtml(news.content)
            : `Baca artikel "${news.title}" di portal berita resmi HIMA-IF UBSI PSDKU Sukabumi.`
        const coverUrl = news.cover ? `${storageUrl}/${news.cover}` : null
        const canonicalUrl = `${siteUrl}/${slug}`
        const keywords: string[] = [
            news.category?.name,
            ...(news.tags ?? []),
            'HIMA-IF', 'UBSI Sukabumi', 'berita informatika',
        ].filter(Boolean) as string[]

        return {
            title,
            description,
            keywords,
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                title,
                description,
                url: canonicalUrl,
                type: 'article',
                locale: 'id_ID',
                siteName: 'HIMA-IF News',
                publishedTime: news.published_at ?? news.created_at,
                modifiedTime: news.updated_at,
                authors: news.author ? [news.author] : undefined,
                section: news.category?.name ?? 'Berita',
                tags: news.tags ?? [],
                ...(coverUrl && {
                    images: [
                        {
                            url: coverUrl,
                            width: 1200,
                            height: 630,
                            alt: news.title,
                        },
                    ],
                }),
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                ...(coverUrl && {images: [coverUrl]}),
            },
        }
    } catch {
        return {
            title: 'HIMA-IF News',
            description: 'Portal berita resmi HIMA-IF UBSI PSDKU Sukabumi.',
        }
    }
}

const NewsHubDetailPage = async ({params}: Props) => {
    const {slug} = await params
    return <ModuleNewsDetailPage slug={slug}/>
}

export default NewsHubDetailPage
