import { NextRequest, NextResponse } from 'next/server'
import {
    parseHost,
    ROUTE_SUBDOMAINS,
    SUBDOMAIN_ROUTES,
} from '@/lib/subdomain'

export function proxy(request: NextRequest) {
    const url = request.nextUrl.clone()
    const pathname = url.pathname

    /**
     * Ignore Next.js internals, APIs and static assets.
     */
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        /\.[^/]+$/.test(pathname)
    ) {
        return NextResponse.next()
    }

    /**
     * Example:
     * localhost:3000
     * news.localhost:3000
     * himaifubsismi.or.id
     * news.himaifubsismi.or.id
     */
    const host = request.headers.get('host') ?? ''

    /**
     * Base domain from .env
     */
    const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL!)
    const siteDomain = siteUrl.hostname

    /**
     * Parse current hostname
     */
    const { hostname, subdomain, isLocal } = parseHost(
        host,
        siteDomain,
    )

    /**
     * --------------------------------------------------
     * Redirect internal folders to subdomains
     *
     * /news-hub/article
     * -> news.domain.com/article
     * --------------------------------------------------
     */
    const firstSegment = pathname.split('/')[1]
    const mappedSubdomain = ROUTE_SUBDOMAINS[firstSegment]

    if (mappedSubdomain && subdomain !== mappedSubdomain) {
        const redirect = url.clone()

        if (isLocal) {
            redirect.host = `${mappedSubdomain}.localhost${url.port ? `:${url.port}` : ''}`
        } else {
            redirect.protocol = siteUrl.protocol
            redirect.host = `${mappedSubdomain}.${siteDomain}`
            redirect.port = ''
        }

        redirect.pathname =
            pathname.replace(`/${firstSegment}`, '') || '/'

        return NextResponse.redirect(redirect)
    }

    /**
     * --------------------------------------------------
     * Rewrite subdomain to internal folder
     *
     * news.domain.com/article
     * -> /news-hub/article
     * --------------------------------------------------
     */
    const mappedFolder = SUBDOMAIN_ROUTES[subdomain]

    if (mappedFolder) {
        if (!pathname.startsWith(`/${mappedFolder}`)) {
            url.pathname = `/${mappedFolder}${pathname === '/' ? '' : pathname}`

            return NextResponse.rewrite(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|assets).*)',
    ],
}