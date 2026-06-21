import ModulePortalNewsDetailPage from "@/modules/portal/pages/news-detail.page";
import {Metadata} from "next";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    return {
        title: "Berita – HIMA-IF UBSI PSDKU Sukabumi",
        description: "Berita dan artikel dari HIMA-IF UBSI PSDKU Sukabumi"
    };
}

const Page = async ({params}: Props) => {
    const {slug} = await params;
    return <ModulePortalNewsDetailPage slug={slug}/>;
};

export default Page;
