import ModuleNewsCategoryPage from '@/modules/news/pages/news-category.page'
import {Metadata} from 'next'

type Props = {
    params: Promise<{categorySlug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {categorySlug} = await params
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'
    const siteUrl = process.env.NEXT_PUBLIC_NEWS_URL ?? 'http://news.localhost:3000'
    const canonicalUrl = `${siteUrl}/category/${categorySlug}`

    // Default fallback
    const labelFallback = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ')

    try {
        const res = await fetch(`${apiUrl}/news/categories/${categorySlug}?cursor=`, {
            next: {revalidate: 60 * 60}, // revalidate every 1 hour
        })

        if (res.ok) {
            const json = await res.json()
            const category = json?.category

            if (category) {
                const title = `Kategori ${category.name} – HIMA-IF News`
                const description = category.description
                    ?? `Baca berita terbaru kategori ${category.name} dari HIMA-IF UBSI PSDKU Sukabumi.${category.published_news_count ? ` Tersedia ${category.published_news_count} artikel.` : ''}`

                return {
                    title,
                    description,
                    keywords: [
                        category.name,
                        `berita ${category.name}`,
                        'HIMA-IF', 'UBSI Sukabumi', 'informatika',
                        `${category.name} mahasiswa informatika`,
                    ],
                    alternates: {
                        canonical: canonicalUrl,
                    },
                    openGraph: {
                        title,
                        description,
                        url: canonicalUrl,
                        type: 'website',
                        locale: 'id_ID',
                        siteName: 'HIMA-IF News',
                    },
                    twitter: {
                        card: 'summary',
                        title,
                        description,
                    },
                }
            }
        }
    } catch {
        // fallthrough to default
    }

    // Fallback when API fails or category not found
    return {
        title: `Kategori ${labelFallback} – HIMA-IF News`,
        description: `Baca berita terbaru kategori ${labelFallback} dari HIMA-IF UBSI PSDKU Sukabumi.`,
        alternates: {
            canonical: canonicalUrl,
        },
    }
}

const NewsHubCategoryPage = async ({params}: Props) => {
    const {categorySlug} = await params
    return <ModuleNewsCategoryPage categorySlug={categorySlug}/>
}

export default NewsHubCategoryPage
