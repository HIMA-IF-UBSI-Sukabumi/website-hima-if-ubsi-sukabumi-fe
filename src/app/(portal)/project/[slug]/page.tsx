import { Metadata } from "next";
import ModulePortalProjectDetailPage from "@/modules/portal/pages/project-detail.page";
import { resolveImageUrl } from "@/lib/utils";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';
    const canonicalUrl = `/project/${slug}`;

    try {
        const res = await fetch(`${apiUrl}/projects/${slug}`, {
            next: { revalidate: 60 * 60 }, // revalidate every 1 hour
        });

        if (res.ok) {
            const json = await res.json();
            const project = json?.project;

            if (project) {
                const cleanDesc = project.description
                    ? project.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
                    : "Showcase proyek teknologi dan inovasi karya mahasiswa Informatika UBSI PSDKU Sukabumi.";

                const coverUrl = resolveImageUrl(project.cover_image);
                const ogImages = coverUrl ? [{ url: coverUrl, alt: project.title }] : [];

                return {
                    title: project.title,
                    description: cleanDesc,
                    keywords: [
                        project.title,
                        "proyek HIMA-IF",
                        "karya mahasiswa UBSI",
                        "portfolio informatika",
                        project.author?.name ?? "mahasiswa IF",
                        "Sukabumi",
                    ],
                    alternates: {
                        canonical: canonicalUrl,
                    },
                    openGraph: {
                        title: `${project.title} | Karya Mahasiswa HIMA-IF`,
                        description: cleanDesc,
                        url: canonicalUrl,
                        type: 'article',
                        locale: 'id_ID',
                        ...(ogImages.length > 0 && { images: ogImages }),
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: `${project.title} | Karya Mahasiswa HIMA-IF`,
                        description: cleanDesc,
                        ...(coverUrl && { images: [coverUrl] }),
                    },
                };
            }
        }
    } catch {
        // Fallback below
    }

    return {
        title: "Detail Proyek Mahasiswa",
        description: "Informasi detail proyek inovasi teknologi mahasiswa Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
        keywords: [
            "proyek HIMA-IF",
            "karya mahasiswa informatika",
            "UBSI PSDKU Sukabumi",
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: "Detail Proyek Mahasiswa | HIMA-IF UBSI PSDKU Sukabumi",
            description: "Informasi detail proyek inovasi teknologi mahasiswa Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
            url: canonicalUrl,
            type: 'article',
            locale: 'id_ID',
        },
        twitter: {
            card: 'summary_large_image',
            title: "Detail Proyek Mahasiswa | HIMA-IF UBSI PSDKU Sukabumi",
            description: "Informasi detail proyek inovasi teknologi mahasiswa Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
        },
    };
}

const Page = async ({ params }: Props) => {
    const { slug } = await params;
    return <ModulePortalProjectDetailPage slug={slug} />;
};

export default Page;
