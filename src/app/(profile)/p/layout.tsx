import type { Metadata } from "next";
import ProfileNavbar from "@/modules/profile/components/ProfileNavbar";
import ProfileFooter from "@/modules/profile/components/ProfileFooter";

export const metadata: Metadata = {
    title: {
        default: "Profil Talent | HIMA-IF UBSI PSDKU Sukabumi",
        template: "%s | HIMA-IF Talent",
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
        <div className="flex min-h-screen flex-col bg-gray-50/70 text-gray-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
            <ProfileNavbar />
            <main className="flex-1">{children}</main>
            <ProfileFooter />
        </div>
    );
}
