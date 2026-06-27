import ModuleNewsCategoryPage from '@/modules/news/pages/news-category.page'
import {Metadata} from 'next'

type Props = {
    params: Promise<{categorySlug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {categorySlug} = await params
    const label = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
    return {
        title: `Kategori ${label} – HIMA-IF News`,
        description: `Baca berita terbaru kategori ${label} dari HIMA-IF UBSI PSDKU Sukabumi.`,
        alternates: {
            canonical: `/category/${categorySlug}`,
        },
    }
}

const NewsHubCategoryPage = async ({params}: Props) => {
    const {categorySlug} = await params
    return <ModuleNewsCategoryPage categorySlug={categorySlug}/>
}

export default NewsHubCategoryPage
