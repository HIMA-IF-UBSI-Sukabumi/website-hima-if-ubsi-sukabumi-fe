import type { Metadata } from "next";
import ModuleElectionResultsPage from "@/modules/elections/pages/election-results.page";
import type { ElectionDetail } from "@/modules/elections/services/api/elections.service";

type Props = {
    params: Promise<{ slug: string }>;
};

async function fetchElection(slug: string): Promise<ElectionDetail | null> {
    const apiUrl =
        process.env.API_URL ??
        process.env.NEXT_PUBLIC_API_URL ??
        "http://localhost:8080/api";
    try {
        const res = await fetch(`${apiUrl}/elections/${slug}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.election ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const election = await fetchElection(slug);

    if (!election) {
        return {
            title: "Hasil Pemilu Tidak Ditemukan",
            robots: { index: false, follow: false },
        };
    }

    return {
        title: `Hasil ${election.title}`,
        description: `Hasil perolehan suara resmi untuk ${election.title} di HIMA-IF SuaraMu.`,
    };
}

export default async function ElectionResultsPage({ params }: Props) {
    const { slug } = await params;
    return <ModuleElectionResultsPage slug={slug} />;
}
