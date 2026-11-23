import type { Metadata } from "next";
import ModuleTalentsDetailPage from "@/modules/talents/pages/talent-detail.page";
import type { TalentDetailResponse } from "@/modules/talents/services/api/talent.service";
import { resolveImageUrl } from "@/lib/utils";

type Props = {
    params: Promise<{ identifier: string }>;
};

async function fetchTalentProfile(identifier: string): Promise<TalentDetailResponse | null> {
    const apiUrl =
        process.env.API_URL ??
        process.env.NEXT_PUBLIC_API_URL ??
        "http://localhost:8080/api";
    try {
        const res = await fetch(`${apiUrl}/talents/${encodeURIComponent(identifier)}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        return (await res.json()) as TalentDetailResponse;
    } catch {
        return null;
    }
}

function buildDescription(data: TalentDetailResponse): string {
    const { profile, projects, achievements, certificates } = data;
    if (profile.headline && profile.bio) {
        return `${profile.headline}. ${profile.bio}`.replace(/\s+/g, " ").trim().slice(0, 160);
    }
    if (profile.headline) {
        return `${profile.headline}. Portofolio ${profile.name} di HIMA-IF UBSI PSDKU Sukabumi.`.slice(0, 160);
    }
    if (profile.bio) {
        return profile.bio.replace(/\s+/g, " ").trim().slice(0, 160);
    }

    const parts: string[] = [];
    if (projects.length > 0) parts.push(`${projects.length} proyek`);
    if (achievements.length > 0) parts.push(`${achievements.length} prestasi`);
    if (certificates.length > 0) parts.push(`${certificates.length} sertifikat`);

    const summary = parts.length > 0 ? ` (${parts.join(", ")})` : "";
    return `Portofolio publik ${profile.name}${summary}, mahasiswa Informatika HIMA-IF UBSI PSDKU Sukabumi.`.slice(0, 160);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { identifier } = await params;
    const data = await fetchTalentProfile(identifier);

    if (!data?.profile) {
        return {
            title: "Profil Tidak Ditemukan",
            description: "Profil mahasiswa yang Anda cari tidak tersedia atau bersifat privat.",
            robots: { index: false, follow: false },
        };
    }

    const { profile } = data;
    const canonicalSlug = profile.profile_slug || identifier;
    const canonicalPath = `/p/${canonicalSlug}`;
    const title = `${profile.name} - Profil Talent`;
    const description = buildDescription(data);
    const avatarUrl = resolveImageUrl(profile.avatar);
    const ogImage = avatarUrl || "/assets/logo-himaif.webp";

    return {
        title,
        description,
        keywords: [
            profile.name,
            profile.nim,
            ...profile.skills,
            "Profil Talent HIMA-IF",
            "Portofolio Mahasiswa Informatika",
            "UBSI PSDKU Sukabumi",
        ],
        alternates: {
            canonical: canonicalPath,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            type: "profile",
            locale: "id_ID",
            url: canonicalPath,
            title: `${profile.name} | HIMA-IF Talent`,
            description,
            images: [
                {
                    url: ogImage,
                    alt: `Foto profil ${profile.name}`,
                },
            ],
        },
        twitter: {
            card: avatarUrl ? "summary_large_image" : "summary",
            title: `${profile.name} | HIMA-IF Talent`,
            description,
            images: [ogImage],
        },
    };
}

export default async function TalentProfilePage({ params }: Props) {
    const { identifier } = await params;
    return <ModuleTalentsDetailPage identifier={identifier} />;
}
