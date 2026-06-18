import ModulePortalEventDetailPage from "@/modules/portal/pages/event-detail.page";
import {Metadata} from "next";
import {dummyEvents} from "@/constants/dummy-events";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params;
    const event = dummyEvents.find((e) => (e.slug ?? e.id) === slug);

    return {
        title: event
            ? `${event.title} – HIMA-IF UBSI PSDKU Sukabumi`
            : "Kegiatan – HIMA-IF UBSI PSDKU Sukabumi",
        description: event
            ? `${event.title} – Kegiatan dan acara dari HIMA-IF UBSI PSDKU Sukabumi`
            : "Website Resmi Himpunan Mahasiswa Informatika Universitas Bina Sarana Informatika PSDKU Sukabumi",
    };
}

const Page = async ({params}: Props) => {
    const {slug} = await params;
    return <ModulePortalEventDetailPage slug={slug}/>;
};

export default Page;
