import { simpleRequest } from "@/core/services/base.service";
import { AxiosInstance } from "axios";

export interface ProjectAuthor {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
}

export interface ProjectItem {
    id: string;
    title: string;
    description: string | null;
    project_url: string | null;
    published_at: string | null;
    status: string;
    slug: string;
    cover_image: string | null;
    author: ProjectAuthor | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectDetail extends ProjectItem {
    carousel_images?: Record<string, string> | string[] | null;
    gallery_images?: Record<string, string> | string[] | null;
    other_projects?: ProjectItem[];
}

export interface ProjectsListResponse {
    data: ProjectItem[];
    path: string;
    per_page: number;
    next_cursor: string | number | null;
    next_page_url: string | null;
}

export interface ProjectDetailResponse {
    project: ProjectDetail;
}

export interface ProjectFilterParams {
    search?: string;
    q?: string;
    author_id?: string | null;
    per_page?: number;
    cursor?: string | null;
}

export const projectService = {
    findAll: (
        client: AxiosInstance,
        params?: ProjectFilterParams
    ) => simpleRequest<ProjectsListResponse>('GET', '/projects')(client, params ? {
        ...(params.search ? { search: params.search } : {}),
        ...(params.author_id ? { author_id: params.author_id } : {}),
        ...(params.per_page ? { per_page: params.per_page } : {}),
        ...(params.cursor ? { cursor: params.cursor } : {}),
    } : null),

    findBySlug: (
        client: AxiosInstance,
        slug: string
    ) => simpleRequest<ProjectDetailResponse>('GET', `/projects/${slug}`)(client),
};
