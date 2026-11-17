import { Suspense } from "react";
import type { Metadata } from "next";
import ModuleElectionsAuthCallbackPage from "@/modules/elections/pages/elections-auth-callback.page";

export const metadata: Metadata = {
    title: "Autentikasi SSO",
    robots: { index: false, follow: false },
};

export default function ElectionsAuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">
                    Memuat...
                </div>
            }
        >
            <ModuleElectionsAuthCallbackPage />
        </Suspense>
    );
}
