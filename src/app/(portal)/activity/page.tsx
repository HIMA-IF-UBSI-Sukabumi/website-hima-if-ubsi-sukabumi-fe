import type {Metadata} from 'next';
import ModulePortalActivityPage from "@/modules/portal/pages/activity.page";

export const metadata: Metadata = {
    title: "Kegiatan - HIMA-IF UBSI PSDKU Sukabumi",
    description: "Daftar kegiatan, acara, seminar, workshop, dan program kerja Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
    alternates: {
        canonical: '/activity',
    },
}

const Page = () => {
    return (
        <ModulePortalActivityPage/>
    )
}

export default Page