import { getNewsUrl, getStorageUrl } from '@/lib/utils'
import ModuleNewsDetailPage from '@/modules/news/pages/news-detail.page'
import { NewsDetail } from '@/modules/news/services/api/news.service'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

async function fetchNews(slug: string): Promise<NewsDetail | null> {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'
    try {
        const res = await fetch(`${apiUrl}/news/${slug}`, {
            next: { revalidate: 60 * 60 },
        })
        if (!res.ok) return null
        const json = await res.json()
        return json?.news ?? null
    } catch {
        return null
    }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params
    const storageUrl = getStorageUrl() ?? ''
    const siteUrl = getNewsUrl()

    const news = await fetchNews(slug)

    if (!news) {
        return {
            title: 'Berita Tidak Ditemukan | HIMA-IF News',
            description: 'Artikel yang kamu cari tidak tersedia di HIMA-IF News.',
            robots: {index: false, follow: false},
        }
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
}

const NewsHubDetailPage = async ({params}: Props) => {
    const {slug} = await params

    // Fetch server-side — Next.js deduplicates ini dengan fetch yang sama di generateMetadata
    const news = await fetchNews(slug)

    if (!news) notFound()

    return <ModuleNewsDetailPage slug={slug} initialNews={news} />
}

export default NewsHubDetailPage
