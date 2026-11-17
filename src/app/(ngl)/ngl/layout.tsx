import type { Metadata } from "next";
import NglNavbar from "@/modules/ngl/components/NglNavbar";
import NglFooter from "@/modules/ngl/components/NglFooter";
import { getNglUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
    const siteUrl = getNglUrl();
    return {
        metadataBase: (() => {
            try {
                return new URL(siteUrl);
            } catch {
                return new URL("https://ngl.himaifubsismi.or.id");
            }
        })(),
        title: {
            default: "HIMA-IF NGL – Pesan Anonim HIMA-IF UBSI PSDKU Sukabumi",
            template: "%s | HIMA-IF NGL",
        },
        description:
            "Kirim pesan rahasia untuk sesama mahasiswa Informatika atau aspirasi anonim ke pengurus HIMA-IF UBSI PSDKU Sukabumi.",
        openGraph: {
            siteName: "HIMA-IF NGL",
            locale: "id_ID",
            type: "website",
            url: "/",
        },
    };
}

export default function NglLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-gray-900">
            <NglNavbar />
            <main className="flex-1">{children}</main>
            <NglFooter />
        </div>
    );
}
