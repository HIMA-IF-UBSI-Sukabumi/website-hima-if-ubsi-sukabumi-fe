import { Suspense } from "react";
import type { Metadata } from "next";
import ModuleNglAuthCallbackPage from "@/modules/ngl/pages/ngl-auth-callback.page";

export const metadata: Metadata = {
    title: "Autentikasi SSO",
    robots: { index: false, follow: false },
};

export default function NglAuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">
                    Memuat...
                </div>
            }
        >
            <ModuleNglAuthCallbackPage />
        </Suspense>
    );
}
