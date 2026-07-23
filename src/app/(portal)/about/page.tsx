import type {Metadata} from 'next';
import ModulePortalAboutPage from "@/modules/portal/pages/about.page";

export const metadata: Metadata = {
    title: "Tentang",
    description: "Mengenal lebih dekat Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi — sejarah, visi, misi, struktur kepengurusan, dan nilai-nilai organisasi.",
    keywords: [
        "tentang HIMA-IF",
        "profil HIMA-IF Sukabumi",
        "sejarah HIMA-IF",
        "visi misi HIMA-IF",
        "struktur pengurus HIMA-IF",
        "Himpunan Mahasiswa Informatika UBSI Sukabumi",
    ],
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: "Tentang | HIMA-IF UBSI PSDKU Sukabumi",
        description: "Mengenal lebih dekat Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi — sejarah, visi, misi, dan struktur kepengurusan.",
        url: '/about',
        type: 'website',
        locale: 'id_ID',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Tentang | HIMA-IF UBSI PSDKU Sukabumi",
        description: "Mengenal lebih dekat Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi — sejarah, visi, misi, dan struktur kepengurusan.",
    },
}

const Page = () => {
    return (
        <ModulePortalAboutPage/>
    )
}

export default Page