import type { Metadata } from "next";
import ModuleNglSendPage from "@/modules/ngl/pages/ngl-send.page";

type Props = {
    params: Promise<{ nim: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { nim } = await params;
    return {
        title: `Kirim Pesan Anonim (${nim})`,
        description: `Kirim pesan anonim untuk mahasiswa dengan NIM ${nim} melalui HIMA-IF NGL.`,
    };
}

export default async function NglNimPage({ params }: Props) {
    const { nim } = await params;
    return <ModuleNglSendPage initialNim={nim} />;
}
