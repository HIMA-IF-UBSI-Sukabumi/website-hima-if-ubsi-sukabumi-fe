import type {Metadata} from 'next';
import ModulePortalLandingPage from "@/modules/portal/pages/landing.page";

export const metadata: Metadata = {
    title: "Beranda",
    description: "Website Resmi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi. Temukan informasi terbaru seputar organisasi, kegiatan, departemen, dan berita mahasiswa informatika.",
    keywords: [
        "HIMA-IF Sukabumi",
        "Himpunan Mahasiswa Informatika",
        "UBSI PSDKU Sukabumi",
        "beranda HIMA-IF",
        "organisasi mahasiswa informatika",
    ],
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "Beranda | HIMA-IF UBSI PSDKU Sukabumi",
        description: "Website Resmi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi. Temukan informasi terbaru seputar organisasi, kegiatan, dan berita.",
        url: '/',
        type: 'website',
        locale: 'id_ID',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Beranda | HIMA-IF UBSI PSDKU Sukabumi",
        description: "Website Resmi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi. Temukan informasi terbaru seputar organisasi, kegiatan, dan berita.",
    },
}

const Page = () => {
    return (
        <ModulePortalLandingPage/>
    )
}

export default Page