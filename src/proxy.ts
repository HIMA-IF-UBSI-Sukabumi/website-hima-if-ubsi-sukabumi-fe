import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
    const hostname = request.headers.get('host') || ''
    const newsSubdomain = process.env.NEWS_SUBDOMAIN || 'news'

    const isNewsSubdomain =
        hostname === `${newsSubdomain}.localhost` ||
        hostname.startsWith(`${newsSubdomain}.localhost:`) ||
        hostname.startsWith(`${newsSubdomain}.himaifubsismi`)

    if (isNewsSubdomain) {
        const url = request.nextUrl.clone()
        const pathname = url.pathname

        if (
            pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname.startsWith('/news-hub') ||
            /\.[a-z]{2,4}$/i.test(pathname)
        ) {
            return NextResponse.next()
        }

        url.pathname = `/news-hub${pathname === '/' ? '' : pathname}`
        return NextResponse.rewrite(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public assets
         */
        '/((?!_next/static|_next/image|favicon.ico|assets).*)',
    ],
}
