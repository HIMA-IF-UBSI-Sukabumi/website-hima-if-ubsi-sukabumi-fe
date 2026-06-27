import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getStorageUrl = () => {
    return process.env.NEXT_PUBLIC_STORAGE_URL;
}

export function formatTimestamp(timestamp: string) {
    return new Date(timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

export function getSubdomainUrl(subdomain: string) {
    const site = new URL(process.env.NEXT_PUBLIC_SITE_URL!)

    if (site.hostname === 'localhost') {
        return `${site.protocol}//${subdomain}.localhost${site.port ? `:${site.port}` : ''}`
    }

    return `${site.protocol}//${subdomain}.${site.hostname}${site.port ? `:${site.port}` : ''}`
}

export const getNewsUrl = (path?: string) => {
    return getSubdomainUrl('news') + (path?.startsWith('/') ? path : `/${path}` || '')
}