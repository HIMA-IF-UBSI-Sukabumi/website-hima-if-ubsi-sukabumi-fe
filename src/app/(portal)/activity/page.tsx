import type {Metadata} from 'next';
import ModulePortalActivityPage from "@/modules/portal/pages/activity.page";

export const metadata: Metadata = {
    title: "Kegiatan",
    description: "Daftar kegiatan, acara, seminar, workshop, dan program kerja Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi. Pantau terus agenda terbaru kami.",
    keywords: [
        "kegiatan HIMA-IF",
        "acara mahasiswa informatika Sukabumi",
        "seminar IT UBSI Sukabumi",
        "workshop mahasiswa informatika",
        "program kerja HIMA-IF",
        "event HIMA-IF Sukabumi",
    ],
    alternates: {
        canonical: '/activity',
    },
    openGraph: {
        title: "Kegiatan | HIMA-IF UBSI PSDKU Sukabumi",
        description: "Daftar kegiatan, acara, seminar, workshop, dan program kerja Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
        url: '/activity',
        type: 'website',
        locale: 'id_ID',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Kegiatan | HIMA-IF UBSI PSDKU Sukabumi",
        description: "Daftar kegiatan, acara, seminar, workshop, dan program kerja Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
    },
}

const Page = () => {
    return (
        <ModulePortalActivityPage/>
    )
}

export default Page