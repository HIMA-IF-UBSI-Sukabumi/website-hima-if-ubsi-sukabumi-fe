'use client'

import Carousel from "@/modules/portal/components/Carousel";
import {CAROUSEL_DATA} from "@/constants/activity";
import CardEvent from "@/modules/portal/components/CardEvent";
import {EVENT_DATA} from "@/constants/event";
import useAxios from "@/core/hooks/use-axios";
import {useQuery} from "@tanstack/react-query";
import {eventService} from "@/modules/portal/services/api/event.service";

const ModulePortalActivityPage = () => {
    const axios = useAxios();

    const activity = useQuery({
        queryKey: ['activity-data'],
        queryFn: async () => await eventService.findAll(axios)
    })

    return (
        <section
            className="relative overflow-hidden mt-32 md:mt-32 pb-16 md:pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
            <div className="relative flex items-center justify-center w-full">
                <div className="w-full md:max-w-5xl lg:max-w-6xl">
                    <Carousel items={CAROUSEL_DATA}/>
                </div>
            </div>

            <div className="relative w-full mt-12 md:mt-16">
                <h1 className="text-xl md:text-2xl font-archivo">
                    Kegiatan/Acara Terlaksana
                </h1>
                <p className="text-secondary text-sm md:text-base">
                    Don't Miss Out
                </p>

                {activity.isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-64 bg-gray-200 animate-pulse rounded-3xl"
                            />
                        ))}
                    </div>
                ) : activity.data?.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-10 text-center px-4">
                        <p className="text-base md:text-lg font-semibold text-gray-700">
                            Belum ada kegiatan
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Nantikan event menarik lainnya 🚀
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-6 px-4">
                        {activity.data?.data.map((event: any, i: number) => (
                            <CardEvent
                                key={i}
                                title={event.title}
                                description={event.description}
                                image={"/assets/event-image.png"}
                                date={event.start_date}
                                tag={event.status}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="relative w-full mt-12 md:mt-16">
                <h1 className="text-xl md:text-2xl font-archivo">
                    Acara Mendatang
                </h1>
                <p className="text-secondary text-sm md:text-base">
                    Don't Miss Out
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-6">
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