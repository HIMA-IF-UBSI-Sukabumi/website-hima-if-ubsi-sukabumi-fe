import { simpleBodyRequest, simpleParamsRequest, simpleRequest } from "@/core/services/base.service";
import type { AxiosInstance } from "axios";

export type ElectionStatus = "draft" | "active" | "closed";
export type ResultVisibility = "hidden" | "after_closed" | "scheduled";
export type VoterReason =
    | "not_eligible"
    | "already_voted"
    | "inactive"
    | "not_active"
    | "not_started"
    | "ended";

export interface ElectionSummary {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: ElectionStatus;
    starts_at: string;
    ends_at: string;
    result_visibility: ResultVisibility;
    show_results_at: string | null;
    is_voting_open: boolean;
    can_show_results: boolean;
    candidates_count: number;
    participations_count: number;
    created_at: string;
    updated_at: string;
}

export interface Candidate {
    id: string;
    name: string;
    number: number;
    photo: string | null;
    photo_url: string | null;
    vision_mission: string | null;
}

export interface ElectionDetail extends ElectionSummary {
    candidates: Candidate[];
}

export interface VoterStatus {
    is_eligible: boolean;
    has_voted: boolean;
    can_vote: boolean;
    reason: VoterReason | null;
}

export interface MyElectionItem extends ElectionSummary {
    voter_status: VoterStatus;
}

export interface ElectionsListResponse {
    data: ElectionSummary[];
    path: string;
    per_page: number;
    next_cursor: string | null;
    next_page_url: string | null;
    prev_cursor: string | null;
    prev_page_url: string | null;
}

export interface ElectionDetailResponse {
    election: ElectionDetail;
}

export interface ElectionResultItem {
    candidate_id: string;
    name: string;
    number: number;
    photo: string | null;
    votes: number;
    deleted_at: string | null;
}

export interface ElectionResultsResponse {
    election: ElectionSummary;
    results: ElectionResultItem[];
    total_votes: number;
}

export interface ElectionMyStatusResponse {
    election: ElectionSummary;
    status: VoterStatus;
}

export interface MyElectionsResponse {
    elections: MyElectionItem[];
}

export interface VoteRequest {
    candidate_id: string;
}

export interface VoteResponse {
    message: string;
    has_voted: boolean;
    voted_at?: string;
}

export interface ElectionsQueryParams {
    status?: "active" | "closed";
    cursor?: string;
}

export const VOTER_REASON_MESSAGES: Record<VoterReason, string> = {
    not_eligible: "Akun Anda tidak terdaftar dalam daftar pemilih (DPT) untuk pemilu ini.",
    already_voted: "Anda sudah memberikan suara pada pemilu ini. Terima kasih atas partisipasi Anda!",
    inactive: "Status keanggotaan mahasiswa Anda sedang tidak aktif.",
    not_active: "Pemilu ini sedang tidak dalam status aktif.",
    not_started: "Periode pemungutan suara belum dimulai.",
    ended: "Periode pemungutan suara telah berakhir.",
};

export const electionsService = {
    findAll: (client: AxiosInstance, params?: ElectionsQueryParams) =>
        simpleParamsRequest<ElectionsQueryParams, ElectionsListResponse>(
            "GET",
            "/elections"
        )(client, params),

    findBySlug: (client: AxiosInstance, slug: string) =>
        simpleRequest<ElectionDetailResponse>("GET", `/elections/${slug}`)(client),

    findResults: (client: AxiosInstance, slug: string) =>
        simpleRequest<ElectionResultsResponse>("GET", `/elections/${slug}/results`)(client),

    findMyStatus: (client: AxiosInstance, slug: string) =>
        simpleRequest<ElectionMyStatusResponse>("GET", `/elections/${slug}/my-status`)(client),

    findMyElections: (client: AxiosInstance) =>
        simpleRequest<MyElectionsResponse>("GET", "/me/elections")(client),

    vote: (client: AxiosInstance, slug: string, data: VoteRequest) =>
        simpleBodyRequest<VoteRequest, VoteResponse>("POST", `/elections/${slug}/vote`)(
            client,
            data
        ),
};
