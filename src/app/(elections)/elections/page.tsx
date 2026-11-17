import type { Metadata } from "next";
import ModuleElectionsListPage from "@/modules/elections/pages/elections-list.page";

export const metadata: Metadata = {
    title: "Daftar Pemilu",
    description:
        "Daftar pemilihan umum resmi Himpunan Mahasiswa Informatika UBSI PSDKU Sukabumi.",
};

export default function ElectionsPage() {
    return <ModuleElectionsListPage />;
}
