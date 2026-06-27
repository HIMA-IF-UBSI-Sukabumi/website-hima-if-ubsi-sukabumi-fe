import { PaginatedResponse, simpleRequest } from "@/core/services/base.service";
import { AxiosInstance } from "axios";

export const newsService = {
    findAll: (
        client: AxiosInstance,
        author_id?: string | null,
        search?: string,
        category_slug?: string,
        tag?: string,
        cursor?: string,
    ) => simpleRequest<PaginatedResponse<NewsResponse>>('GET', 'news')(client, {
        author_id,
        search,
        category_slug,
        tag,
        cursor,
    }),

    findFeatured: (
        client: AxiosInstance,
    ) => simpleRequest<FeaturedNewsResponse>('GET', 'news/featured')(client),

    findPopular: (
        client: AxiosInstance,
    ) => simpleRequest<PopularNewsResponse>('GET', 'news/popular')(client),

    findCategories: (
        client: AxiosInstance,
    ) => simpleRequest<CategoriesResponse>('GET', 'news/categories')(client),

    findByCategory: (
        client: AxiosInstance,
        categorySlug: string,
        cursor?: string,
    ) => simpleRequest<CategoryNewsResponse>('GET', `news/categories/${categorySlug}`)(client, {
        cursor,
    }),

    findBySlug: (
        client: AxiosInstance,
        slug: string,
    ) => simpleRequest<DetailNewsResponse>('GET', `news/${slug}`)(client)
}

export interface NewsCategory {
    id: string;
    name: string;
    slug: string;
}

export interface NewsResponse {
    news: News
}

export interface News {
    id: string;
    title: string;
    slug: string;
    author: string;
    published_at: string;
    status: string;
    category: NewsCategory | null;
    tags: string[];
    is_featured: boolean;
    view_count: number;
    cover: string | null;
    created_at: string;
    updated_at: string;
}

export type FeaturedNews = News;

export interface FeaturedNewsResponse {
    news: FeaturedNews[];
}

export interface PopularNewsResponse {
    news: FeaturedNews[];
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    published_news_count?: number;
}

export interface CategoriesResponse {
    categories: Category[];
}

export interface CategoryNewsResponse {
    category: Category;
    data: PaginatedResponse<NewsResponse>;
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
    category: NewsCategory | null;
    tags: string[];
    is_featured: boolean;
    view_count: number;
    cover: string | null;
    created_at: string;
    updated_at: string;
    related_news: RelatedNews[];
}

export interface RelatedNews {
    id: string;
    title: string;
    slug: string;
    cover: string | null;
    published_at: string;
    category: NewsCategory | null;
}

export const NEWS_CATEGORIES = [
    { label: 'Semua', value: null },
    { label: 'Akademik', value: 'akademik' },
    { label: 'Organisasi', value: 'organisasi' },
    { label: 'Acara', value: 'acara' },
    { label: 'Prestasi', value: 'prestasi' },
    { label: 'Teknologi', value: 'teknologi' },
    { label: 'Umum', value: 'umum' },
]
