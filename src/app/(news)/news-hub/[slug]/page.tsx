import ModuleNewsDetailPage from '@/modules/news/pages/news-detail.page'
import {Metadata} from 'next'

type Props = {
    params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params
    return {
        title: `Berita – HIMA-IF News`,
        description: `Baca artikel dan berita terbaru dari HIMA-IF UBSI PSDKU Sukabumi`,
        alternates: {
            canonical: `/${slug}`,
        },
    }
}

const NewsHubDetailPage = async ({params}: Props) => {
    const {slug} = await params
    return <ModuleNewsDetailPage slug={slug}/>
}

export default NewsHubDetailPage
