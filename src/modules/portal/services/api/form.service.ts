import {simpleRequest} from "@/core/services/base.service";
import {AxiosInstance} from "axios";

export const formService = {
    resolveShortlink: (
        client: AxiosInstance,
        shortlink: string,
    ) => simpleRequest<ShortlinkResponse>('GET', `/forms/s/${shortlink}`)(client),
}

export interface ShortlinkResponse {
    slug: string;
    shortlink: string;
    title: string;
    form_url: string;
}
