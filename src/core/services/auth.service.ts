import { simpleBodyRequest, simpleRequest } from "@/core/services/base.service";
import type { SocialMediaLinks } from "@/core/types/social-media";
import type { AxiosInstance } from "axios";

export type SsoAudience = "elections" | "ngl";

export interface AuthUser {
    id: string;
    name: string;
    nim: string;
    status: string;
    roles: string[];
    profile_picture?: string | null;
    social_media?: SocialMediaLinks | null;
}

export interface AuthExchangeRequest {
    code: string;
    audience: SsoAudience;
}

export interface AuthResponse {
    token: string;
    expires_in: number;
    user: AuthUser;
}

export interface AuthMeResponse {
    user?: AuthUser;
    id?: string;
    name?: string;
    nim?: string;
    status?: string;
    roles?: string[];
}

export const authService = {
    ssoExchange: simpleBodyRequest<AuthExchangeRequest, AuthResponse>(
        "POST",
        "/auth/sso/exchange"
    ),
    me: (client: AxiosInstance) =>
        simpleRequest<AuthMeResponse>("GET", "/auth/me")(client),
    logout: (client: AxiosInstance) =>
        simpleRequest<{ message?: string }>("POST", "/auth/logout")(client),
};
