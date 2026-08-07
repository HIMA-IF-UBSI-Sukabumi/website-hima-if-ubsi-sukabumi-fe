import { notFound } from "next/navigation";
import FormRenderer from "@/modules/portal/components/forms/FormRenderer";
import ThemeToggle from "@/components/theme-toggle";
import type { FormDetail } from "@/modules/portal/services/api/form.service";

type Props = {
    params: Promise<{ shortlink: string }>;
};

type FetchResult<T> = { ok: boolean; status: number; data?: T };

async function fetchJson<T>(url: string): Promise<FetchResult<T>> {
    try {
        const res = await fetch(url, {
            cache: "no-store",
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    } catch {
        return { ok: false, status: 500 };
    }
}

function StatusCard({ message, extra }: { message: string; extra?: string }) {
    return (
        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center px-4 py-24 text-center">
            <div className="absolute right-4 top-4">
                <ThemeToggle/>
            </div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{message}</h1>
            {extra && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{extra}</p>}
        </div>
    );
}

const Page = async ({ params }: Props) => {
    const { shortlink } = await params;
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

    // 1) Coba resolve sebagai shortlink; kalau bukan shortlink, anggap sebagai slug langsung.
    let slug = shortlink;
    const resolved = await fetchJson<{ slug: string }>(`${apiUrl}/forms/s/${shortlink}`);
    if (resolved.ok && resolved.data?.slug) {
        slug = resolved.data.slug;
    }

    // 2) Ambil data form (server-side, aman dari CORS).
    const formResult = await fetchJson<{ form: FormDetail }>(`${apiUrl}/forms/${slug}`);

    if (!formResult.ok) {
        if (formResult.status === 404) {
            notFound();
        }
        const data = formResult.data as
            | { message?: string; opens_at?: string; closed_at?: string }
            | undefined;
        const message = data?.message ?? "Form tidak tersedia saat ini.";
        const extra = data?.opens_at
            ? `Form akan dibuka pada ${new Date(data.opens_at).toLocaleString("id-ID")}.`
            : data?.closed_at
                ? `Form telah ditutup pada ${new Date(data.closed_at).toLocaleString("id-ID")}.`
                : undefined;
        return <StatusCard message={message} extra={extra} />;
    }

    const form = formResult.data!.form;

    return <FormRenderer form={form} />;
};

export default Page;
