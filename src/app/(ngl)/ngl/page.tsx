import type { Metadata } from "next";
import ModuleNglSendPage from "@/modules/ngl/pages/ngl-send.page";

export const metadata: Metadata = {
    title: "Kirim Pesan Anonim",
    description:
        "Kirim pesan anonim ke mahasiswa Informatika atau pengurus HIMA-IF UBSI PSDKU Sukabumi.",
};

export default function NglPage() {
    return <ModuleNglSendPage />;
}
