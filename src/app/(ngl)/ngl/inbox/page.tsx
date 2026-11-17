import type { Metadata } from "next";
import ModuleNglInboxPage from "@/modules/ngl/pages/ngl-inbox.page";

export const metadata: Metadata = {
    title: "Inbox Saya",
    robots: { index: false, follow: false },
};

export default function NglInboxPage() {
    return <ModuleNglInboxPage />;
}
