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

export interface EventResponse {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    is_published: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'published';
    is_implemented: boolean;
    image: string;
}