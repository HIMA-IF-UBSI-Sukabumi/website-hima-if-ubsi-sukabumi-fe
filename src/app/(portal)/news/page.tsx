import {redirect} from 'next/navigation'

const NewsRedirectPage = () => {
    const newsUrl = process.env.NEXT_PUBLIC_NEWS_URL || 'http://news.localhost:3000'
    redirect(newsUrl)
}

export default NewsRedirectPage