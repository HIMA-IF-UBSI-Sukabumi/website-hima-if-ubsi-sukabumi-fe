import ModulePortalDepartmentPage from "@/modules/portal/pages/department.page";
import {Metadata} from "next";

import { DEPARTMENT_DATA } from "@/constants/department";

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const department = DEPARTMENT_DATA.find(d => d.slug === slug);

    const title = department 
        ? `Departemen ${department.title} – HIMA-IF UBSI PSDKU Sukabumi`
        : "Departemen - HIMA-IF UBSI PSDKU Sukabumi";

    const description = department
        ? department.description.slice(0, 160) + "..."
        : "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi";

    return {
        title,
        description,
        alternates: {
            canonical: `/department/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `/department/${slug}`,
            type: 'website',
        }
    };
}

const Page = async ({params}: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    return (
        <ModulePortalDepartmentPage slug={slug}/>
    )
}

export default Page