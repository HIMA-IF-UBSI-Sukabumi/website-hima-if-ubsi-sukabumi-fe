import {PaginatedResponse, simpleRequest} from "@/core/services/base.service";
import {AxiosInstance} from "axios";

export const eventService = {
    findAll: (
        client: AxiosInstance,
        is_implemented: boolean,
        time_filter: 'upcoming' | 'soon' | 'past' | null,
    ) => simpleRequest<PaginatedResponse<EventResponse>>('GET', '/events')(client, {
        is_implemented,
        time_filter,
    })
}

export interface EventImage {
    id: string;
    imageable_type: string;
    imageable_id: string;
    image_url: string;
    usage: 'cover' | 'carousel' | 'gallery';
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface EventResponse {
    id?: string;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string;
    published_at: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'published';
    is_implemented: boolean;
    slug: string | null;
    cover_image: string | null;
    carousel_images: string[];
    galler_image: string[];
    location?: string | null;
    time_filter?: string | null;
}