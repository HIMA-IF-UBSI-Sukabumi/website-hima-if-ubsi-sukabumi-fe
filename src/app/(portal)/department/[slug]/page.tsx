import ModulePortalDepartmentPage from "@/modules/portal/pages/department.page";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Department - HIMA-IF UBSI PSDKU Sukabumi",
    description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
}

const Page = async ({params}: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    return (
        <ModulePortalDepartmentPage slug={slug}/>
    )
}

export default Page