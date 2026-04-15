import Carousel from "@/modules/portal/components/Carousel";
import {CAROUSEL_DATA} from "@/constants/activity";

const ModulePortalActivityPage = () => {
    return (
        <section className={'relative overflow-hidden mt-32 pb-20 max-w-6xl mx-auto'}>
                <div className="relative flex items-center justify-center w-full h-full mx-auto">
                    <Carousel items={CAROUSEL_DATA} />
                </div>
        </section>
    )
}

export default ModulePortalActivityPage;