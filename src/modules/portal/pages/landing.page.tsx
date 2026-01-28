import HeroLanding from "@/modules/portal/components/landing/hero.landing";
import AboutLanding from "@/modules/portal/components/landing/about.landing";
import CabinetLanding from "@/modules/portal/components/landing/cabinet.landing";
import DepartmentLanding from "@/modules/portal/components/landing/department.landing";

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