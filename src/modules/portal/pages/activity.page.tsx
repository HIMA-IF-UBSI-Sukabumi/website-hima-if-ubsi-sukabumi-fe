'use client'

import Carousel, {CarouselItem} from "@/modules/portal/components/Carousel";
import CardEvent from "@/modules/portal/components/CardEvent";
import useAxios from "@/core/hooks/use-axios";
import {useQuery} from "@tanstack/react-query";
import {EventResponse, eventService} from "@/modules/portal/services/api/event.service";
import {getStorageUrl} from "@/lib/utils";

const ModulePortalActivityPage = () => {
    const axios = useAxios();
    const storageUrl = getStorageUrl();

    const implementedEvent = useQuery({
        queryKey: ['implemented-event-data'],
        queryFn: async () => await eventService.findAll(axios, true, null)
    })

    const upcomingEvent = useQuery({
        queryKey: ['upcoming-event-data'],
        queryFn: async () => await eventService.findAll(axios, false, 'upcoming')
    })

    const soonEvent = useQuery({
        queryKey: ['soon-event-data'],
        queryFn: async () => await eventService.findAll(axios, false, 'soon')
    })

    const carouselData: CarouselItem[] | undefined = soonEvent.data?.data.length === 0 ? [] : soonEvent.data?.data.map((event: EventResponse) => ({
        title: event.title,
        image: `${storageUrl}/${event.carousel_images}`,
        description: event.description,
    }))

    return (
        <section
            className="relative overflow-hidden mt-32 md:mt-32 pb-16 md:pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
            <div className="relative flex items-center justify-center w-full">
                <div className="w-full md:max-w-5xl lg:max-w-6xl">
                    {soonEvent.isLoading ? (
                        <div className="relative w-full h-80 sm:h-100 md:h-112.5 lg:h-125 overflow-hidden rounded-2xl md:rounded-3xl bg-gray-200 animate-pulse"></div>
                    ) : soonEvent.data?.data.length === 0 ? null : (
                        <Carousel items={carouselData ?? []}/>
                    )}
                </div>
            </div>

            <div className="relative w-full mt-12 md:mt-16">
                <h1 className="text-xl md:text-2xl font-archivo">
                    Kegiatan/Acara Terlaksana
                </h1>
                <p className="text-secondary text-sm md:text-base">
                    Don&#39;t Miss Out
                </p>

                {implementedEvent.isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-64 bg-gray-200 animate-pulse rounded-3xl"
                            />
                        ))}
                    </div>
                ) : implementedEvent.data?.data.length === 0 ? (
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
                        {implementedEvent.data?.data.map((event: EventResponse, i: number) => (
                            <CardEvent
                                key={i}
                                title={event.title}
                                description={event?.description}
                                image={`${storageUrl}/${event.cover_image}`}
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
                    Don&#39;t Miss Out
                </p>

                {upcomingEvent.isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-64 bg-gray-200 animate-pulse rounded-3xl"
                            />
                        ))}
                    </div>
                ) : upcomingEvent.data?.data.length === 0 ? (
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
                        {upcomingEvent.data?.data.map((event: EventResponse, i: number) => (
                            <CardEvent
                                key={i}
                                title={event.title}
                                description={event.description}
                                image={`${storageUrl}/${event.cover_image}`}
                                date={event.start_date}
                                tag={event.status}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default ModulePortalActivityPage;