import type {Metadata} from 'next';
import ModulePortalLandingPage from "@/modules/portal/pages/landing.page";

export const metadata: Metadata = {
    title: "Beranda - HIMA-IF UBSI PSDKU Sukabumi",
    description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
}

const Page = () => {
    return (
        <ModulePortalLandingPage/>
    )
}

export default Page