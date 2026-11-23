import type { Metadata } from "next";
import TalentNavbar from "@/modules/talents/components/TalentNavbar";
import TalentFooter from "@/modules/talents/components/TalentFooter";

export const metadata: Metadata = {
    title: {
        default: "Portfolio | HIMA-IF UBSI PSDKU Sukabumi",
        template: "%s | HIMA-IF Portfolio",
    },
    description:
        "Portofolio publik mahasiswa dan alumni Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
};

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50/70 text-gray-900">
            <TalentNavbar />
            <main className="flex-1">{children}</main>
            <TalentFooter />
        </div>
    );
}
