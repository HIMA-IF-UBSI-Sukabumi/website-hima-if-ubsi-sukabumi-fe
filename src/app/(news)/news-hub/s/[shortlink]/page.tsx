import { notFound, redirect } from 'next/navigation';
import type { NewsShortlinkResponse } from '@/modules/news/services/api/news.service';

type Props = {
    params: Promise<{ shortlink: string }>;
};

const NewsShortlinkPage = async ({ params }: Props) => {
    const { shortlink } = await params;
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

    let targetUrl: string | null = null;

    try {
        const res = await fetch(`${apiUrl}/news/s/${shortlink}`, {
            cache: 'no-store',
        });

        if (res.ok) {
            const data: NewsShortlinkResponse = await res.json();
            targetUrl = data?.slug ? `/${data.slug}` : (data?.news_url || data?.url || null);
        }
    } catch {
        // network / parse error
    }

    if (!targetUrl) {
        notFound();
    }

    redirect(targetUrl);
};

export default NewsShortlinkPage;
