import {MetadataRoute} from 'next'

/**
 * Dynamic sitemap that includes:
 * - Static news hub pages
 * - All published news articles (fetched from API)
 * - All news categories (fetched from API)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'
    const siteUrl = process.env.NEXT_PUBLIC_NEWS_URL ?? 'http://news.localhost:3000'

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${siteUrl}/news-hub`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
    ]

    // ── Fetch all categories ──
    let categoryRoutes: MetadataRoute.Sitemap = []
    try {
        const res = await fetch(`${apiUrl}/news/categories`, {
            next: {revalidate: 60 * 60 * 6}, // revalidate every 6 hours
        })
        if (res.ok) {
            const json = await res.json()
            const categories: Array<{slug: string}> = json?.categories ?? []
            categoryRoutes = categories.map((cat) => ({
                url: `${siteUrl}/category/${cat.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        }
    } catch {
        // ignore, return partial sitemap
    }

    // ── Fetch all news (cursor pagination – collect up to 500 items) ──
    let newsRoutes: MetadataRoute.Sitemap = []
    try {
        let cursor: string | null = null
        let collected = 0
        const MAX_ITEMS = 500

        while (collected < MAX_ITEMS) {
            const url = new URL(`${apiUrl}/news`)
            if (cursor) url.searchParams.set('cursor', cursor)

            const res = await fetch(url.toString(), {
                next: {revalidate: 60 * 60}, // revalidate every 1 hour
            })

            if (!res.ok) break

            const json = await res.json()
            const items: Array<{news: {slug: string; updated_at?: string; published_at?: string}}> = json?.data ?? []

            if (items.length === 0) break

            for (const item of items) {
                newsRoutes.push({
                    url: `${siteUrl}/${item.news.slug}`,
                    lastModified: item.news.updated_at
                        ? new Date(item.news.updated_at)
                        : new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.9,
                })
            }

            collected += items.length
            cursor = json?.next_cursor ? String(json.next_cursor) : null
            if (!cursor) break
        }
    } catch {
        // ignore, return partial sitemap
    }

    return [...staticRoutes, ...categoryRoutes, ...newsRoutes]
}
