'use client'

import { useState } from "react";

interface ShareOptions {
    title?: string;
    text?: string;
}

/**
 * Shares the current page via the Web Share API when available,
 * falling back to copying the URL to the clipboard.
 */
export const useSharePage = () => {
    const [copied, setCopied] = useState(false);

    const share = async (options?: ShareOptions) => {
        if (typeof window === "undefined") return;
        const url = window.location.href;

        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            try {
                await navigator.share({
                    title: options?.title ?? document.title,
                    text: options?.text,
                    url,
                });
                return;
            } catch (err) {
                if ((err as Error)?.name === "AbortError") return;
            }
        }

        if (typeof navigator !== "undefined" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                // ignore clipboard permission errors
            }
        }
    };

    return { share, copied };
};
