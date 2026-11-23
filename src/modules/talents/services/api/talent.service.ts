import { simpleRequest } from "@/core/services/base.service";
import type { AxiosInstance } from "axios";

export interface TalentSocialLinks {
    instagram: string | null;
    linkedin: string | null;
    github: string | null;
}

export interface TalentProfile {
    id: string;
    nim: string;
    name: string;
    status: "aktif" | "alumni" | null;
    profile_slug: string;
    avatar: string | null;
    headline: string | null;
    bio: string | null;
    skills: string[];
    social_links: TalentSocialLinks;
}

export interface TalentOrganizationItem {
    kabinet: string | null;
    year: string | null;
    is_active: boolean;
    departemen: string | null;
    jabatan: string | null;
    is_leader: boolean;
}

export interface TalentProjectItem {
    id: string;
    title: string;
    slug: string | null;
    description: string | null;
    project_url: string | null;
    cover_image: string | null;
    role: string;
    is_author: boolean;
    published_at: string | null;
}

export interface TalentAchievementItem {
    id: string;
    title: string;
    slug: string | null;
    description: string | null;
    level: string | null;
    date_achieved: string | null;
    cover_image: string | null;
    published_at: string | null;
}

export interface TalentCertificateItem {
    id: string;
    certificate_number: string;
    short_code: string;
    verify_url: string;
    issued_at: string | null;
    event: {
        id: string;
        title: string;
        slug: string | null;
    } | null;
}

export interface TalentCommitteeItem {
    id: string;
    role: string | null;
    position?: string | null;
    event: {
        id: string;
        title: string;
        slug: string | null;
    } | null;
}

export interface TalentDetailResponse {
    profile: TalentProfile;
    organization_history: TalentOrganizationItem[];
    projects: TalentProjectItem[];
    achievements: TalentAchievementItem[];
    certificates: TalentCertificateItem[];
    committees: TalentCommitteeItem[];
}

export const talentService = {
    findByIdentifier: (client: AxiosInstance, identifier: string) =>
        simpleRequest<TalentDetailResponse>("GET", `/talents/${encodeURIComponent(identifier)}`)(
            client
        ),
};
