import type {Metadata} from "next"
import ModulePortalPengurusPage from "@/modules/portal/pages/pengurus.page"
import {use} from "react";

type PageProps = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    {params}: PageProps
): Promise<Metadata> {
    const {slug} = await params
    const name = slug.replace(/-/g, " ").toUpperCase()

    return {
        title: `${name} - HIMA-IF UBSI PSDKU Sukabumi`,
        description: `Halaman pengurus ${name} HIMA-IF UBSI PSDKU Sukabumi`,
    }
}

const Page = ({params}: PageProps) => {
    const {slug} = use(params)

    return (
        <ModulePortalPengurusPage slug={slug}/>
    )
}

export default Page
