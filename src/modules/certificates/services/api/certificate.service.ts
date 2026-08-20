import { simpleRequest } from "@/core/services/base.service";
import { AxiosInstance } from "axios";

export interface CertificateSigner {
    id: string;
    name: string;
    position: string;
    photo: string | null;
    photo_url: string | null;
    signing_order: number;
}

export interface CertificateEvent {
    title: string;
    slug: string;
    start_date: string;
    end_date: string;
    location: string;
    is_implemented: boolean;
}

export interface CertificateRecipient {
    name: string;
    email: string;
    is_guest: boolean;
}

export interface CertificateDownloadUrls {
    pdf: string;
    jpg: string;
    png: string;
    preview_image: string;
}

export interface CertificateData {
    id: string;
    short_code: string;
    certificate_number: string;
    issued_at: string;
    is_valid: boolean;
    verification_url: string;
    download_urls: CertificateDownloadUrls;
    recipient: CertificateRecipient;
    event: CertificateEvent;
    signers: CertificateSigner[];
}

export interface CertificateVerificationResponse {
    success: boolean;
    data: CertificateData;
    message?: string;
}

export const certificateService = {
    verifyByCode: (
        client: AxiosInstance,
        code: string,
    ) => simpleRequest<CertificateVerificationResponse>('GET', `certificates/${code}/verify`)(client),
}

