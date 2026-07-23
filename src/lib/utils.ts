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
    try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        if (!siteUrl) {
            // Fallback aman jika env tidak di-set
            return `https://${subdomain}.himaifubsismi.or.id`
        }
        const site = new URL(siteUrl)

        if (site.hostname === 'localhost') {
            return `${site.protocol}//${subdomain}.localhost${site.port ? `:${site.port}` : ''}`
        }

        return `${site.protocol}//${subdomain}.${site.hostname}${site.port ? `:${site.port}` : ''}`
    } catch {
        return `https://${subdomain}.himaifubsismi.or.id`
    }
}

export const getNewsUrl = (path?: string) => {
    return getSubdomainUrl('news') + (path && !path.startsWith('/') ? '/' + path : path || '')
}