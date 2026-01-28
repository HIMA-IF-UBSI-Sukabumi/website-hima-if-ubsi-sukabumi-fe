import {use} from "react";
import ModulePortalPengurusPage from "@/modules/portal/pages/pengurus.page";

type PageProps = {
    params: Promise<{
        slug: string;
    }>
}

const Page = ({params}: PageProps) => {
    const {slug} = use(params)

    return (
        <ModulePortalPengurusPage slug={slug}/>
    );
}

export default Page;