import Carousel from "@/modules/portal/components/Carousel";
import {CAROUSEL_DATA} from "@/constants/activity";
import CardEvent from "@/modules/portal/components/CardEvent";
import {EVENT_DATA} from "@/constants/event";

const ModulePortalActivityPage = () => {
    return (
        <section className={'relative overflow-hidden mt-32 pb-20 max-w-6xl mx-auto'}>
            <div className="relative flex items-center justify-center w-full h-full mx-auto">
                <Carousel items={CAROUSEL_DATA}/>
            </div>

            <div className={'relative w-full h-full mt-16'}>
                <h1 className={'text-2xl font-archivo'}>Kegiatan/Acara Terlaksana</h1>
                <p className={"text-secondary"}>Don't Miss Out</p>

                <div className={'grid grid-cols-1 md:grid-cols-3 mt-6 gap-6'}>
                    {EVENT_DATA.map((event, i) => (
                        <CardEvent
                            key={i}
                            title={event.name}
                            description={event.description}
                            image={event.image}
                            date={event.date}
                            tag={event.tag}
                        />
                    ))}
                </div>
            </div>

            <div className={'relative w-full h-full mt-16'}>
                <h1 className={'text-2xl font-archivo'}>Acara Mendatang</h1>
                <p className={"text-secondary"}>Don't Miss Out</p>

                <div className={'grid grid-cols-1 md:grid-cols-3 mt-6 gap-6'}>
                    {EVENT_DATA.map((event, i) => (
                        <CardEvent
                            key={i}
                            title={event.name}
                            description={event.description}
                            image={event.image}
                            date={event.date}
                            tag={event.tag}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ModulePortalActivityPage;