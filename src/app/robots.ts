import { headers } from 'next/headers'
import { MetadataRoute } from 'next'
import { parseHost } from '@/lib/subdomain'

export default async function robots(): Promise<MetadataRoute.Robots> {
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

    // Serve rules for news subdomain
    if (subdomain === 'news') {
        return {
            rules: [
                {
                    userAgent: '*',
                    allow: '/',
                    disallow: [
                        '/api/',
                        '/_next/',
                    ],
                },
                {
                    // Explicitly allow Googlebot for news indexing
                    userAgent: 'Googlebot',
                    allow: '/',
                },
                {
                    // Allow Google News crawler
                    userAgent: 'Googlebot-News',
                    allow: '/',
                },
            ],
            sitemap: `${currentBaseUrl}/sitemap.xml`,
            host: currentBaseUrl,
        }
    }

    // Serve rules for main portal
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/_next/',
                ],
            },
        ],
        sitemap: `${currentBaseUrl}/sitemap.xml`,
        host: currentBaseUrl,
    }
}
