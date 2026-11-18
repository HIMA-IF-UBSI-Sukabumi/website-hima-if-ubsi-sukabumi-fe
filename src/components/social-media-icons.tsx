'use client'

import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import type { SocialMediaLinks } from "@/core/types/social-media";
import { cn } from "@/lib/utils";

interface SocialMediaIconsProps {
    links?: SocialMediaLinks | null;
    variant?: "light" | "dark-overlay";
    className?: string;
}

const SOCIAL_ITEMS: Array<{
    key: keyof SocialMediaLinks;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
}> = [
    { key: "instagram", label: "Instagram", Icon: FaInstagram },
    { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin },
    { key: "github", label: "GitHub", Icon: FaGithub },
];

const SocialMediaIcons = ({
    links,
    variant = "light",
    className,
}: SocialMediaIconsProps) => {
    if (!links) return null;

    const available = SOCIAL_ITEMS.filter(({ key }) => Boolean(links[key]));
    if (available.length === 0) return null;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {available.map(({ key, label, Icon }) => {
                const href = links[key];
                if (!href) return null;

                return (
                    <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
                            variant === "dark-overlay"
                                ? "bg-white/15 text-white hover:bg-white hover:text-primary backdrop-blur-xs"
                                : "bg-gray-100 text-gray-600 hover:bg-primary hover:text-white"
                        )}
                    >
                        <Icon className="w-3.5 h-3.5" />
                    </a>
                );
            })}
        </div>
    );
};

export default SocialMediaIcons;
