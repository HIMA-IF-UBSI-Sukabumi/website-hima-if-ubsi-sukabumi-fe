import {redirect} from 'next/navigation'

type Props = {
    params: Promise<{slug: string}>
}

const NewsSlugRedirectPage = async ({params}: Props) => {
    const {slug} = await params
    const newsUrl = process.env.NEXT_PUBLIC_NEWS_URL || 'http://news.localhost:3000'
    redirect(`${newsUrl}/${slug}`)
}

export default NewsSlugRedirectPage
