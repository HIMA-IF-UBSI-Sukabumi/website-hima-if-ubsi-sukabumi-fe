import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

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