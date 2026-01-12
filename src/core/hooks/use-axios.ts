import axios, {
    type AxiosResponse,
    type CreateAxiosDefaults,
    type InternalAxiosRequestConfig,
} from "axios";
import {useEffect, useMemo} from "react";

const defaultClientBuilder = (): CreateAxiosDefaults => ({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 600000,
});

const useAxios = () => {
    return useMemo(() => axios.create(defaultClientBuilder()), []);
};

type RequestInterceptor = (
    config: InternalAxiosRequestConfig
) =>
    | InternalAxiosRequestConfig
    | Promise<InternalAxiosRequestConfig>;

type ResponseInterceptor = (
    response: AxiosResponse
) => AxiosResponse | Promise<AxiosResponse>;

type ErrorInterceptor = (error: any) => any;

export const useAxiosWithCustomResponseInterceptor = ({
                                                          onRequest,
                                                          onFulfilled,
                                                          onRejected,
                                                      }: {
    onRequest?: RequestInterceptor;
    onFulfilled?: ResponseInterceptor;
    onRejected?: ErrorInterceptor;
}) => {
    const client = useAxios();

    useEffect(() => {
        const reqIdx = client.interceptors.request.use(
            onRequest ?? ((config) => config),
            onRejected
        );

        const resIdx = client.interceptors.response.use(
            onFulfilled ?? ((response) => response),
            onRejected
        );

        return () => {
            client.interceptors.request.eject(reqIdx);
            client.interceptors.response.eject(resIdx);
        };
    }, [client, onRequest, onFulfilled, onRejected]);

    return client;
};

export default useAxios;
