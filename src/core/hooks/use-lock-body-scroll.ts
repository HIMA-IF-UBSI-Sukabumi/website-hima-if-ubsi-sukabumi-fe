'use client'

import { useEffect } from "react";

/**
 * Locks page scrolling on both <html> and <body> while a modal or overlay is open.
 */
export const useLockBodyScroll = (locked: boolean) => {
    useEffect(() => {
        if (!locked) return;

        const html = document.documentElement;
        const body = document.body;

        const previousHtmlOverflow = html.style.overflow;
        const previousBodyOverflow = body.style.overflow;
        const previousOverscroll = html.style.overscrollBehavior;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        html.style.overscrollBehavior = "none";

        return () => {
            html.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyOverflow;
            html.style.overscrollBehavior = previousOverscroll;
        };
    }, [locked]);
};
