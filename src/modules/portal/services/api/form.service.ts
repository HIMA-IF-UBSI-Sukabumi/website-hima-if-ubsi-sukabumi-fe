import {simpleBodyRequest, simpleRequest} from "@/core/services/base.service";
import {AxiosInstance} from "axios";

export const formService = {
    resolveShortlink: (
        client: AxiosInstance,
        shortlink: string,
    ) => simpleRequest<ShortlinkResponse>('GET', `/forms/s/${shortlink}`)(client),

    getForm: (
        client: AxiosInstance,
        slug: string,
    ) => simpleRequest<FormResponse>('GET', `/forms/${slug}`)(client),

    submitForm: (
        client: AxiosInstance,
        slug: string,
        payload: SubmitPayload,
    ) => simpleBodyRequest<SubmitPayload, SubmitResponse>('POST', `/forms/${slug}/submit`)(client, payload),
}

export interface ShortlinkResponse {
    slug: string;
    shortlink: string;
    title: string;
    form_url: string;
}

export type QuestionType = "text" | "textarea" | "email" | "number" | "date" | "radio" | "checkbox" | "select";

export interface FormQuestionOption {
    id: string;
    label: string;
    value: string;
}

export interface FormQuestion {
    id: string;
    label: string;
    description: string | null;
    type: QuestionType;
    is_required: boolean;
    options: FormQuestionOption[];
}

export type ParticipantFieldKey = "full_name" | "nim" | "class" | "email" | "phone" | "institution";

export type ParticipantFields = Partial<Record<ParticipantFieldKey, { enabled: boolean }>>;

export interface FormDetail {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: string;
    attendance_enabled: boolean;
    require_login: boolean;
    allow_multiple_submissions: boolean;
    participant_fields: ParticipantFields;
    success_message: string | null;
    start_at: string | null;
    end_at: string | null;
    questions: FormQuestion[];
    shortlink: string | null;
}

export interface FormResponse {
    form: FormDetail;
}

export interface SubmitPayload {
    answers: Record<string, string | string[]>;
    participant_data: Record<string, string>;
    guest_fingerprint?: string;
}

export interface SubmitResponse {
    message: string;
    success_message: string | null;
    submission_id: string;
    guest_fingerprint: string | null;
    attendance_token: string | null;
    submitted_at: string;
}
