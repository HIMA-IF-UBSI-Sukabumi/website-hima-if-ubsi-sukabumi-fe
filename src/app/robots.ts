import {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_NEWS_URL ?? 'http://news.localhost:3000'
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
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    }
}
