import HeroLanding from "@/modules/portal/pages/section/landing/hero.landing";
import AboutLanding from "@/modules/portal/pages/section/landing/about.landing";
import CabinetLanding from "@/modules/portal/pages/section/landing/cabinet.landing";
import DepartmentLanding from "@/modules/portal/pages/section/landing/department.landing";

const ModulePortalLandingPage = () => {
    return (
        <>
            <HeroLanding/>
            <AboutLanding/>
            <CabinetLanding/>
            <DepartmentLanding/>
        </>
    )
}

export default ModulePortalLandingPage;