/**
 * Maps public subdomains to internal route folders.
 */
export const SUBDOMAIN_ROUTES: Record<string, string> = {
    news: 'news-hub',
}

/**
 * Reverse mapping.
 *
 * news-hub -> news
 */
export const ROUTE_SUBDOMAINS = Object.fromEntries(
    Object.entries(SUBDOMAIN_ROUTES).map(([subdomain, folder]) => [
        folder,
        subdomain,
    ]),
)

/**
 * Parse hostname and detect subdomain.
 */
export function parseHost(host: string, siteDomain: string) {
    // Remove port
    const hostname = host.split(':')[0]

    const isLocal =
        hostname === 'localhost' ||
        hostname.endsWith('.localhost') ||
        hostname === '127.0.0.1'

    let subdomain = ''

    if (isLocal) {
        if (hostname.endsWith('.localhost')) {
            subdomain = hostname.replace('.localhost', '')
        }
    } else {
        if (
            hostname !== siteDomain &&
            hostname.endsWith(`.${siteDomain}`)
        ) {
            subdomain = hostname.replace(`.${siteDomain}`, '')
        }
    }

    return {
        hostname,
        subdomain,
        isLocal,
    }
}