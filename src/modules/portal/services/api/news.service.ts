import {PaginatedResponse, simpleRequest} from "@/core/services/base.service";
import {AxiosInstance} from "axios";

export const newsService = {
    findAll: (
        client: AxiosInstance,
        author_id: string | null,
    ) => simpleRequest<PaginatedResponse<NewsResponse>>('GET', 'news')(client, {
        author_id
    }),
    findBySlug: (
        client: AxiosInstance,
        slug: string,
    ) => simpleRequest<DetailNewsResponse>('GET', `news/${slug}`)(client)
}

export interface NewsResponse {
    news: News
}

export interface News {
    id: string;
    title: string;
    content: string;
    author_id: string;

    is_published: boolean;
    published_at: string | null;

    status: 'pending' | 'approved' | 'rejected' | 'published';

    deleted_at: string | null;
    created_at: string;
    updated_at: string;

    category: string[];
    cover: string | null;
    slug?: string | null;
}

export interface DetailNewsResponse {
    news: NewsDetail;
}

export interface NewsDetail {
    id: string;
    title: string;
    slug: string;
    content: string;
    author: string;
    published_at: string;
    status: string;
    category: string[];
    cover: string;
    created_at: string;
    updated_at: string;
    related_news: RelatedNews[];
}

export interface RelatedNews {
    id: string;
    title: string;
    slug: string;
    cover: string;
    published_at: string;
    category: string[];
}