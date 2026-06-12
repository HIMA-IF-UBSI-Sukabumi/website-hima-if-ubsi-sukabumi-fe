import {PaginatedResponse, simpleRequest} from "@/core/services/base.service";
import {AxiosInstance} from "axios";

export const newsService = {
    findAll: (
        client: AxiosInstance,
        author_id: string | null,
    ) => simpleRequest<PaginatedResponse<NewsResponse>>('GET', 'news')(client, {
        author_id
    })
}

export interface NewsResponse {
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
}