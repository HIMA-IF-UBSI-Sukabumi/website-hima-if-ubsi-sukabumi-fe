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
        title: department ? `Departemen ${department.title}` : "Departemen",
        description,
        keywords: department
            ? [
                `Departemen ${department.title}`,
                `${department.title} HIMA-IF`,
                "departemen HIMA-IF Sukabumi",
                "Himpunan Mahasiswa Informatika UBSI Sukabumi",
            ]
            : [
                "departemen HIMA-IF",
                "Himpunan Mahasiswa Informatika UBSI Sukabumi",
            ],
        alternates: {
            canonical: `/department/${slug}`,
        },
        openGraph: {
            title: department
                ? `Departemen ${department.title} | HIMA-IF UBSI PSDKU Sukabumi`
                : "Departemen | HIMA-IF UBSI PSDKU Sukabumi",
            description,
            url: `/department/${slug}`,
            type: 'website',
            locale: 'id_ID',
        },
        twitter: {
            card: 'summary_large_image',
            title: department
                ? `Departemen ${department.title} | HIMA-IF UBSI PSDKU Sukabumi`
                : "Departemen | HIMA-IF UBSI PSDKU Sukabumi",
            description,
        },
    };
}

const Page = async ({params}: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    return (
        <ModulePortalDepartmentPage slug={slug}/>
    )
}

export default Page