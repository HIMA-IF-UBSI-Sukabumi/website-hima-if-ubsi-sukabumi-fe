import AboutPengurus from "@/modules/portal/pages/section/pengurus/about.pengurus";

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