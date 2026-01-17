import type {AxiosInstance, AxiosRequestConfig} from "axios"

export type EndpointBuilder<Args extends unknown[]> = (...args: Args) => string

export const simpleRequest = <
    R,
    Args extends unknown[] = []
>(
    method: string,
    endpoint: string | ((...args: Args) => string),
    axiosConfig: AxiosRequestConfig<unknown> = {}
) =>
    async (
        client: AxiosInstance,
        params?: Record<string, unknown> | null,
        ...props: Args
    ): Promise<R> => {
        return client
            .request<R>({
                method,
                url: typeof endpoint === "string" ? endpoint : endpoint(...props),
                params,
                ...axiosConfig,
            })
            .then((response) => response.data);
    };


export const simpleParamsRequest = <
    T,
    R,
    Args extends unknown[] = []
>(
    method: string,
    endpoint: string | ((...args: Args) => string),
    axiosConfig: AxiosRequestConfig<unknown> = {}
) =>
    async (
        client: AxiosInstance,
        params?: T,
        ...props: Args
    ): Promise<R> => {
        return client
            .request<R>({
                method,
                url: typeof endpoint === "string" ? endpoint : endpoint(...props),
                params,
                ...axiosConfig,
            })
            .then((response) => response.data);
    };

export const simpleBodyRequest = <
    T,
    R,
    Args extends unknown[] = []
>(
    method: string,
    endpoint: string | ((...args: Args) => string),
    axiosConfig: AxiosRequestConfig<unknown> = {}
) =>
    async (
        client: AxiosInstance,
        data?: T,
        params?: Record<string, unknown> | null,
        ...props: Args
    ): Promise<R> => {
        return client
            .request<R>({
                method,
                url: typeof endpoint === "string" ? endpoint : endpoint(...props),
                data: data,
                params,
                ...axiosConfig,
            })
            .then((response) => response.data);
    };

export const simpleParamsBodyRequest = <
    S,
    T,
    R,
    Args extends unknown[] = []
>(
    method: string,
    endpoint: string | ((...args: Args) => string),
    axiosConfig: AxiosRequestConfig<unknown> = {}
) =>
    async (
        client: AxiosInstance,
        data?: T,
        params?: S,
        ...props: Args
    ): Promise<R> => {
        return client
            .request<R>({
                method,
                url: typeof endpoint === "string" ? endpoint : endpoint(...props),
                data: data,
                params,
                ...axiosConfig,
            })
            .then((response) => response.data);
    };


export const withEndpoint = <T, R>(method: string, group: string) => async (client: AxiosInstance, endpoint?: string | null, data?: T | null, params?: Record<string, unknown> | null): Promise<R> => {
    return client.request<R>({
        method: method,
        url: `${group}/${endpoint || ''}`.replace(/\/$/, ''),
        data: data,
        params: params,
    }).then(response => response.data);
}

export const withParamsEndpoint = <P, T, R>(builder: (params: P, request?: T) => AxiosRequestConfig<unknown>) => async (client: AxiosInstance, request?: T, paramsFixed?: P): Promise<R> => {
    return client.request(builder(paramsFixed || request as P, request)).then(response => response.data);
}

export interface PaginationRequestParams {
    page?: number
    limit?: number
    sort?: string
    dir?: string
    keyword?: string
}

export interface PaginatedResponse<T> {
    limit: number
    page: number
    pages: number
    sortedBy: number
    total: number
    data: T[]
}