import ModulePortalEventDetailPage from "@/modules/portal/pages/activity-detail.page";
import {Metadata} from "next";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';
    const canonicalUrl = `/activity/${slug}`;

    try {
        const res = await fetch(`${apiUrl}/events/${slug}`, {
            next: { revalidate: 60 * 60 }, // revalidate every 1 hour
        });
        if (res.ok) {
            const json = await res.json();
            const event = json?.event;
            if (event) {
                const cleanDesc = event.description
                    ? event.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
                    : "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi";

                const ogImages = event.thumbnail
                    ? [{ url: event.thumbnail, alt: event.title }]
                    : [];

                return {
                    title: event.title,
                    description: cleanDesc,
                    keywords: [
                        event.title,
                        "kegiatan HIMA-IF",
                        "HIMA-IF UBSI Sukabumi",
                        "event mahasiswa informatika",
                        "Sukabumi",
                    ],
                    alternates: {
                        canonical: canonicalUrl,
                    },
                    openGraph: {
                        title: `${event.title} | HIMA-IF UBSI PSDKU Sukabumi`,
                        description: cleanDesc,
                        url: canonicalUrl,
                        type: 'article',
                        locale: 'id_ID',
                        ...(ogImages.length > 0 && { images: ogImages }),
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: `${event.title} | HIMA-IF UBSI PSDKU Sukabumi`,
                        description: cleanDesc,
                        ...(event.thumbnail && { images: [event.thumbnail] }),
                    },
                };
            }
        }
    } catch {
        // ignore
    }

    return {
        title: "Detail Kegiatan",
        description: "Informasi detail kegiatan Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
        keywords: [
            "kegiatan HIMA-IF",
            "event mahasiswa informatika",
            "HIMA-IF UBSI Sukabumi",
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: "Detail Kegiatan | HIMA-IF UBSI PSDKU Sukabumi",
            description: "Informasi detail kegiatan Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
            url: canonicalUrl,
            type: 'article',
            locale: 'id_ID',
        },
        twitter: {
            card: 'summary_large_image',
            title: "Detail Kegiatan | HIMA-IF UBSI PSDKU Sukabumi",
            description: "Informasi detail kegiatan Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
        },
    };
}

const Page = async ({params}: Props) => {
    const {slug} = await params;
    return <ModulePortalEventDetailPage slug={slug}/>;
};

export default Page;
