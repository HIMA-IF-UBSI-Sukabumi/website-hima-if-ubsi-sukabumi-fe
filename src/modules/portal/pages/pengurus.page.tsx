import AboutPengurus from "@/modules/portal/components/pengurus/about.pengurus";

type PageProps = {
    slug: string;
}

const ModulePortalPengurusPage = ({slug}: PageProps) => {
    return (
        <>
            <AboutPengurus slug={slug}/>
        </>
    );
}

export default ModulePortalPengurusPage;