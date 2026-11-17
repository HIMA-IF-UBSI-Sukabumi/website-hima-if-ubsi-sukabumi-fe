import type { Metadata } from "next";
import ModuleNglAdminPage from "@/modules/ngl/pages/ngl-admin.page";

export const metadata: Metadata = {
    title: "Moderasi Admin",
    robots: { index: false, follow: false },
};

export default function NglAdminPage() {
    return <ModuleNglAdminPage />;
}
