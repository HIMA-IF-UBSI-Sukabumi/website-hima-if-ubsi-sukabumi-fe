import ModulePortalEventDetailPage from "@/modules/portal/pages/activity-detail.page";
import {Metadata} from "next";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    return {
        title: "Kegiatan – HIMA-IF UBSI PSDKU Sukabumi",
        description: "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
    };
}

const Page = async ({params}: Props) => {
    const {slug} = await params;
    return <ModulePortalEventDetailPage slug={slug}/>;
};

export default Page;
