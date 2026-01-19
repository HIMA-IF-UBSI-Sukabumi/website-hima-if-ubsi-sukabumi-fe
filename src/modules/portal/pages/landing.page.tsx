import HeroPortal from "@/modules/portal/components/portal/hero.portal";
import AboutPortal from "@/modules/portal/components/portal/about.portal";
import CabinetPortal from "@/modules/portal/components/portal/cabinet.portal";

const ModulePortalLandingPage = () => {
    return (
        <>
            <HeroPortal/>
            <AboutPortal/>
            <CabinetPortal/>
        </>
    )
}

export default ModulePortalLandingPage;