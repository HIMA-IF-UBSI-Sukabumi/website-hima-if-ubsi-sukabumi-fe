import { simpleBodyRequest, simpleParamsRequest, simpleRequest } from "@/core/services/base.service";
import type { AxiosInstance } from "axios";

export type NglMessageFilter = "all" | "unread" | "read";

export interface NglResolveResponse {
    token: string;
    display_name: string;
    expires_in: number;
}

export interface NglSendMessageRequest {
    content: string;
    token?: string | null;
}

export interface NglSendMessageResponse {
    message: string;
}

export interface NglMessageItem {
    id: string;
    content: string;
    read_at: string | null;
    is_read: boolean;
    created_at: string;
}

export interface NglMessagesListResponse {
    data: NglMessageItem[];
    path: string;
    per_page: number;
    next_cursor: string | null;
    next_page_url: string | null;
    prev_cursor: string | null;
    prev_page_url: string | null;
}

export interface NglMessageSingleResponse {
    data: NglMessageItem;
}

export interface NglMessagesQueryParams {
    status?: NglMessageFilter;
    cursor?: string;
}

export const nglService = {
    resolveNim: (client: AxiosInstance, nim: string) =>
        simpleRequest<NglResolveResponse>("GET", `/ngl/resolve/${encodeURIComponent(nim)}`)(
            client
        ),

    sendMessage: (client: AxiosInstance, data: NglSendMessageRequest) =>
        simpleBodyRequest<NglSendMessageRequest, NglSendMessageResponse>(
            "POST",
            "/ngl/messages"
        )(client, data),

    findMyMessages: (client: AxiosInstance, params?: NglMessagesQueryParams) =>
        simpleParamsRequest<NglMessagesQueryParams, NglMessagesListResponse>(
            "GET",
            "/me/ngl-messages"
        )(client, params),

    markMyMessageRead: (client: AxiosInstance, id: string) =>
        simpleRequest<NglMessageSingleResponse>("PATCH", `/me/ngl-messages/${id}/read`)(
            client
        ),

    findAdminMessages: (client: AxiosInstance, params?: NglMessagesQueryParams) =>
        simpleParamsRequest<NglMessagesQueryParams, NglMessagesListResponse>(
            "GET",
            "/admin/ngl-messages"
        )(client, params),

    markAdminMessageRead: (client: AxiosInstance, id: string) =>
        simpleRequest<NglMessageSingleResponse>("PATCH", `/admin/ngl-messages/${id}/read`)(
            client
        ),

    deleteAdminMessage: (client: AxiosInstance, id: string) =>
        simpleRequest<{ message: string }>("DELETE", `/admin/ngl-messages/${id}`)(client),
};
