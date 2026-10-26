import type { Metadata } from 'next';
import ModulePortalProjectPage from "@/modules/portal/pages/project.page";

export const metadata: Metadata = {
    title: "Karya & Proyek Mahasiswa",
    description: "Koleksi proyek inovasi, aplikasi web, mobile, sistem informasi, dan riset teknologi yang dikembangkan oleh mahasiswa Informatika UBSI PSDKU Sukabumi.",
    keywords: [
        "proyek HIMA-IF",
        "karya mahasiswa informatika",
        "portfolio UBSI Sukabumi",
        "proyek teknologi informatika",
        "showcase aplikasi mahasiswa",
        "UBSI PSDKU Sukabumi",
    ],
    alternates: {
        canonical: '/project',
    },
    openGraph: {
        title: "Karya & Proyek Mahasiswa | HIMA-IF UBSI PSDKU Sukabumi",
        description: "Koleksi proyek inovasi, aplikasi web, mobile, sistem informasi, dan riset teknologi yang dikembangkan oleh mahasiswa Informatika UBSI PSDKU Sukabumi.",
        url: '/project',
        type: 'website',
        locale: 'id_ID',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Karya & Proyek Mahasiswa | HIMA-IF UBSI PSDKU Sukabumi",
        description: "Koleksi proyek inovasi, aplikasi web, mobile, sistem informasi, dan riset teknologi yang dikembangkan oleh mahasiswa Informatika UBSI PSDKU Sukabumi.",
    },
};

const Page = () => {
    return <ModulePortalProjectPage />;
};

export default Page;
