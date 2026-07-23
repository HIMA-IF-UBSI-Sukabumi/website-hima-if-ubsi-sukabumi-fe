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
function stripHtml(html: string, maxLength = 125): string {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return text.length > maxLength ? text.slice(0, maxLength - 3).trimEnd() + '...' : text
}

/**
 * Truncate text to maxLength with ellipsis.
 */
function trunc(text: string, max: number): string {
    return text.length > max ? text.slice(0, max - 3).trimEnd() + '...' : text
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

    // ── Title limits ─────────────────────────────────────────────────────────
    // Page <title>: ≤ 60 chars  →  "Judul Artikel | HIMA-IF News"
    const titleSuffix = ' | HIMA-IF News'                       // 15 chars
    const pageTitle = trunc(news.title, 60 - titleSuffix.length) + titleSuffix

    // og:title / twitter:title: ≤ 60 chars (article title only, no suffix)
    const socialTitle = trunc(news.title, 60)

    // ── Description limit: ≤ 125 chars ───────────────────────────────────────
    const description = news.content
        ? stripHtml(news.content, 125)
        : trunc(
            `Baca artikel "${news.title}" di portal berita resmi HIMA-IF UBSI PSDKU Sukabumi.`,
            125
        )

    // ── Canonical & keywords ──────────────────────────────────────────────────
    const canonicalUrl = `${siteUrl}/${slug}`
    const keywords: string[] = [
        news.category?.name,
        ...(news.tags ?? []),
        'HIMA-IF', 'UBSI Sukabumi', 'berita informatika',
    ].filter(Boolean) as string[]

    const coverUrl = news.cover ? `${storageUrl}/${news.cover}` : null

    return {
        title: pageTitle,
        description,
        keywords,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: socialTitle,
            description,
            url: canonicalUrl,
            type: 'article',
            locale: 'id_ID',
            siteName: 'HIMA-IF News',
            publishedTime: news.published_at ?? news.created_at,
            modifiedTime: news.updated_at,
            authors: news.author ? [news.author] : undefined,
            section: news.category?.name ?? 'Berita',
            images: getStorageUrl() + '/' + news.cover,
            tags: news.tags ?? [],
            ...(coverUrl && {
                images: [{ url: coverUrl, width: 1200, height: 630, alt: news.title }],
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title: socialTitle,
            description,
            ...(coverUrl && { images: [coverUrl] }),
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
