import { headers } from 'next/headers'
import { MetadataRoute } from 'next'
import { parseHost } from '@/lib/subdomain'
import { DEPARTMENT_DATA } from '@/constants/department'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const headersList = await headers()
    const hostHeader = headersList.get('host') ?? ''

    const siteDomain = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').hostname
    const { subdomain, isLocal } = parseHost(hostHeader, siteDomain)

    // Reconstruct base URL based on host header
    let currentBaseUrl = ''
    if (isLocal) {
        const protocol = hostHeader.includes('localhost') ? 'http' : 'https'
        currentBaseUrl = `${protocol}://${hostHeader}`
    } else {
        currentBaseUrl = `https://${hostHeader}`
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

    // ── NEWS SUBDOMAIN SITEMAP ──
    if (subdomain === 'news') {
        const staticRoutes: MetadataRoute.Sitemap = [
            {
                url: `${currentBaseUrl}`, // News homepage (subdomain root)
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
        ]

        // Fetch all news categories
        let categoryRoutes: MetadataRoute.Sitemap = []
        try {
            const res = await fetch(`${apiUrl}/news/categories`, {
                next: { revalidate: 60 * 60 * 6 }, // revalidate every 6 hours
            })
            if (res.ok) {
                const json = await res.json()
                const categories: Array<{ slug: string }> = json?.categories ?? []
                categoryRoutes = categories.map((cat) => ({
                    url: `${currentBaseUrl}/category/${cat.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                }))
            }
        } catch {
            // ignore
        }

        // Fetch all news articles
        const newsRoutes: MetadataRoute.Sitemap = []
        try {
            let cursor: string | null = null
            let collected = 0
            const MAX_ITEMS = 500

            while (collected < MAX_ITEMS) {
                const url = new URL(`${apiUrl}/news`)
                if (cursor) url.searchParams.set('cursor', cursor)

                const res = await fetch(url.toString(), {
                    next: { revalidate: 60 * 60 }, // revalidate every 1 hour
                })

                if (!res.ok) break

                const json = await res.json()
                const items: Array<{
                    news: {
                        slug: string
                        updated_at?: string
                        published_at?: string
                    }
                }> = json?.data ?? []

                if (items.length === 0) break

                for (const item of items) {
                    newsRoutes.push({
                        url: `${currentBaseUrl}/${item.news.slug}`,
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
            // ignore
        }

        return [...staticRoutes, ...categoryRoutes, ...newsRoutes]
    }

    // ── MAIN PORTAL SITEMAP ──
    const portalStaticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${currentBaseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${currentBaseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${currentBaseUrl}/activity`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]

    // Map department routes
    const departmentRoutes: MetadataRoute.Sitemap = DEPARTMENT_DATA.map((dept) => ({
        url: `${currentBaseUrl}/department/${dept.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    // Fetch dynamic activities/events
    const eventRoutes: MetadataRoute.Sitemap = []
    
    // Fetch implemented events
    try {
        const res = await fetch(`${apiUrl}/events?is_implemented=true`, {
            next: { revalidate: 60 * 60 },
        })
        if (res.ok) {
            const json = await res.json()
            const items: Array<{ slug: string; published_at?: string; status: string }> = json?.data ?? []
            for (const item of items) {
                if (item.slug && item.status === 'published') {
                    eventRoutes.push({
                        url: `${currentBaseUrl}/activity/${item.slug}`,
                        lastModified: item.published_at ? new Date(item.published_at) : new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.8,
                    })
                }
            }
        }
    } catch {
        // ignore
    }

    // Fetch non-implemented (upcoming/soon) events
    try {
        const res = await fetch(`${apiUrl}/events?is_implemented=false`, {
            next: { revalidate: 60 * 60 },
        })
        if (res.ok) {
            const json = await res.json()
            const items: Array<{ slug: string; published_at?: string; status: string }> = json?.data ?? []
            for (const item of items) {
                if (item.slug && item.status === 'published') {
                    // Avoid duplicates if any
                    if (!eventRoutes.some((route) => route.url.endsWith(`/activity/${item.slug}`))) {
                        eventRoutes.push({
                            url: `${currentBaseUrl}/activity/${item.slug}`,
                            lastModified: item.published_at ? new Date(item.published_at) : new Date(),
                            changeFrequency: 'weekly',
                            priority: 0.8,
                        })
                    }
                }
            }
        }
    } catch {
        // ignore
    }

    return [...portalStaticRoutes, ...departmentRoutes, ...eventRoutes]
}
