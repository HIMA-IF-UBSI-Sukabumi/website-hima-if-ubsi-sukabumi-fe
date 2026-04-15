import {PaginatedResponse, simpleRequest} from "@/core/services/base.service";

export const eventService = {
    findAll: simpleRequest<PaginatedResponse<EventResponse>>("GET", '/events')
}

export interface EventResponse {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    is_published: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'published';
}