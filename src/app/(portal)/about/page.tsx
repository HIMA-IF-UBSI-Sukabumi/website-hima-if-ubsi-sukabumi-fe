import type {Metadata} from 'next';
import ModulePortalAboutPage from "@/modules/portal/pages/about.page";

export const metadata: Metadata = {
    title: "Tentang - HIMA-IF UBSI PSDKU Sukabumi",
    description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
}

const Page = () => {
    return (
        <ModulePortalAboutPage/>
    )
}

export default Page