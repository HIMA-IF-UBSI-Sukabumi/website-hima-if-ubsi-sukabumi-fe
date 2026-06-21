import ModulePortalNewsDetailPage from "@/modules/portal/pages/news-detail.page";
import {Metadata} from "next";
import {dummyNews} from "@/constants/dummy-news";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params;
    const news = dummyNews.find((n) => (n.slug ?? n.id) === slug);

    return {
        title: news ? `${news.title} – HIMA-IF UBSI PSDKU Sukabumi` : "Berita – HIMA-IF UBSI PSDKU Sukabumi",
        description: news
            ? `${news.title} – Berita dan artikel dari HIMA-IF UBSI PSDKU Sukabumi`
            : "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
    };
}

const Page = async ({params}: Props) => {
    const {slug} = await params;
    return <ModulePortalNewsDetailPage slug={slug}/>;
};

export default Page;
