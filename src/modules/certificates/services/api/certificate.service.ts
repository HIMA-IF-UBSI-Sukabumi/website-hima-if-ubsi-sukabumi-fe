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

export const MOCK_CERTIFICATE_DATA: CertificateData = {
    id: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    short_code: "a1b2c3d4",
    certificate_number: "CERT/HIMA-IF/2026/08/001",
    issued_at: "2026-08-19 12:00:00",
    is_valid: true,
    verification_url: "http://localhost:8000/certificates/a1b2c3d4/verify",
    download_urls: {
        pdf: "http://localhost:8000/certificates/a1b2c3d4/download/pdf",
        jpg: "http://localhost:8000/certificates/a1b2c3d4/download/jpg",
        png: "http://localhost:8000/certificates/a1b2c3d4/download/png",
        preview_image: "http://localhost:8000/certificates/a1b2c3d4/preview"
    },
    recipient: {
        name: "Muhammad Hilal",
        email: "hilal@example.com",
        is_guest: false
    },
    event: {
        title: "Workshop Web Development 2026",
        slug: "workshop-web-development-2026",
        start_date: "2026-09-01 09:00:00",
        end_date: "2026-09-01 15:00:00",
        location: "Auditorium UBSI Sukabumi",
        is_implemented: true
    },
    signers: [
        {
            id: "uuid-signer-1",
            name: "Dr. Budi Santoso, M.Kom.",
            position: "Pembina HIMA IF",
            photo: "signers/budi.jpg",
            photo_url: "http://localhost:8000/storage/signers/budi.jpg",
            signing_order: 1
        },
        {
            id: "uuid-signer-2",
            name: "Muhammad Hilal",
            position: "Ketua Pelaksana",
            photo: null,
            photo_url: "http://localhost:8000/storage/profiles/hilal.jpg",
            signing_order: 2
        }
    ]
};
