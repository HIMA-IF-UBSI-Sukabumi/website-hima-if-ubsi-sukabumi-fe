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
    }),
    findBySlug: (
        client: AxiosInstance,
        slug: string,
    ) => simpleRequest<DetailEventResponse>('GET', `/events/${slug}`)(client),
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

export interface DetailEventResponse {
    event: {
        id?: string,
        title: string,
        description: string,
        start_date: string,
        end_date: string,
        published_at: string,
        is_implemented: string,
        status: string,
        form_link: string,
        parent_slug: string,
        proker_slug: string,
        current_slug: string,
        tags: string,
        cover_image: string,
        carousel_images: string,
        gallery_images: string,
        location: string,
        related_events: RelatedEventResponse[]
    },
}

export interface RelatedEventResponse {
    id?: string;
    title: string,
    description: string,
    published_at: string,
    status: string,
    parent_slug: string,
    proker_slug: string,
    current_slug: string,
    cover_image: string,
}