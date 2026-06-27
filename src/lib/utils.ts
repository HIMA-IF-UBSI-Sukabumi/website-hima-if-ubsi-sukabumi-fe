import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getStorageUrl = () => {
    return process.env.NEXT_PUBLIC_STORAGE_URL;
}

export const getNewsUrl = (path?: string) => {
    const base = process.env.NEXT_PUBLIC_NEWS_URL || 'http://news.localhost:3000'
    if (!path) return base
    return `${base}${path.startsWith('/') ? path : `/${path}`}`
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