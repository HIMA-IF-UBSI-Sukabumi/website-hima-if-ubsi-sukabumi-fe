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
                
                return {
                    title: `${event.title} – HIMA-IF UBSI PSDKU Sukabumi`,
                    description: cleanDesc,
                    alternates: {
                        canonical: canonicalUrl,
                    },
                    openGraph: {
                        title: `${event.title} – HIMA-IF UBSI PSDKU Sukabumi`,
                        description: cleanDesc,
                        url: canonicalUrl,
                        type: 'article',
                    }
                };
            }
        }
    } catch {
        // ignore
    }

    return {
        title: "Kegiatan – HIMA-IF UBSI PSDKU Sukabumi",
        description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

const Page = async ({params}: Props) => {
    const {slug} = await params;
    return <ModulePortalEventDetailPage slug={slug}/>;
};

export default Page;
