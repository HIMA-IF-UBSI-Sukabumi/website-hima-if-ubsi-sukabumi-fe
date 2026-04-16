import ModulePortalNewsPage from "@/modules/portal/pages/news.page";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Berita - HIMA-IF UBSI PSDKU Sukabumi",
    description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
}

const Page = () => {
    return (
        <ModulePortalNewsPage/>
    )
}

export default Page