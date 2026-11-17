import type { Metadata } from "next";
import ElectionsNavbar from "@/modules/elections/components/ElectionsNavbar";
import ElectionsFooter from "@/modules/elections/components/ElectionsFooter";
import { getSuaramuUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
    const siteUrl = getSuaramuUrl();
    return {
        metadataBase: (() => {
            try {
                return new URL(siteUrl);
            } catch {
                return new URL("https://suaramu.himaifubsismi.or.id");
            }
        })(),
        title: {
            default: "HIMA-IF SuaraMu – E-Voting Resmi HIMA-IF UBSI PSDKU Sukabumi",
            template: "%s | HIMA-IF SuaraMu",
        },
        description:
            "Platform E-Voting resmi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi. Salurkan hak pilihmu secara jujur, rahasia, dan transparan.",
        openGraph: {
            siteName: "HIMA-IF SuaraMu",
            locale: "id_ID",
            type: "website",
            url: "/",
        },
    };
}

export default function ElectionsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-gray-900">
            <ElectionsNavbar />
            <main className="flex-1">{children}</main>
            <ElectionsFooter />
        </div>
    );
}
