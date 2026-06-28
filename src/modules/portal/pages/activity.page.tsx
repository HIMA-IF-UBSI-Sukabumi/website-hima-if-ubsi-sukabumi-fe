'use client'

import { useRef } from "react";
import Carousel, {CarouselItem} from "@/modules/portal/components/Carousel";
import CardEvent from "@/modules/portal/components/CardEvent";
import useAxios from "@/core/hooks/use-axios";
import {useQuery} from "@tanstack/react-query";
import {EventResponse, eventService} from "@/modules/portal/services/api/event.service";
import {getStorageUrl} from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const ModulePortalActivityPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
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

    const implementedData: EventResponse[] = implementedEvent.data?.data?.length ? implementedEvent.data.data : [];
    const upcomingData: EventResponse[] = upcomingEvent.data?.data?.length ? upcomingEvent.data.data : [];
    const soonData: EventResponse[] = soonEvent.data?.data?.length ? soonEvent.data.data : [];

    const carouselData: CarouselItem[] = soonData.map((event: EventResponse) => ({
        title: event.title,
        image: `${storageUrl}/${event.cover_image}`,
        description: event.description,
        href: `/activity/${event.slug}`,
    }));

    useGSAP(() => {
        // Fade in carousel on load (only if data is ready)
        if (carouselData.length > 0 && document.querySelector(".carousel-wrapper")) {
            gsap.from(".carousel-wrapper", {
                opacity: 0,
                scale: 0.98,
                duration: 1,
                ease: "power3.out"
            });
        }

        // Animate Kegiatan/Acara Terlaksana
        if (document.querySelector(".implemented-header")) {
            gsap.from(".implemented-header > *", {
                scrollTrigger: {
                    trigger: ".implemented-header",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            });
        }

        if (document.querySelector(".implemented-grid") && document.querySelector(".implemented-grid .event-card-anim")) {
            gsap.from(".implemented-grid .event-card-anim", {
                scrollTrigger: {
                    trigger: ".implemented-grid",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 40,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out"
            });
        }

        // Animate Acara Mendatang
        if (document.querySelector(".upcoming-header")) {
            gsap.from(".upcoming-header > *", {
                scrollTrigger: {
                    trigger: ".upcoming-header",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            });
        }

        if (document.querySelector(".upcoming-grid") && document.querySelector(".upcoming-grid .event-card-anim")) {
            gsap.from(".upcoming-grid .event-card-anim", {
                scrollTrigger: {
                    trigger: ".upcoming-grid",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 40,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out"
            });
        }
    }, { scope: containerRef, dependencies: [carouselData.length, implementedData.length, upcomingData.length] });

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden mt-32 md:mt-32 pb-16 md:pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
            <div className="relative flex items-center justify-center w-full">
                <div className="carousel-wrapper w-full md:max-w-5xl lg:max-w-6xl">
                    {soonEvent.isLoading ? (
                        <div
                            className="relative w-full h-80 sm:h-100 md:h-112.5 lg:h-125 overflow-hidden rounded-2xl md:rounded-3xl bg-gray-200 animate-pulse"></div>
                    ) : carouselData.length === 0 ? null : (
                        <Carousel items={carouselData}/>
                    )}
                </div>
            </div>

            <div className="relative w-full mt-12 md:mt-16">
                <div className="implemented-header">
                    <h1 className="text-xl md:text-2xl font-archivo">
                        Kegiatan/Acara Terlaksana
                    </h1>
                    <p className="text-secondary text-sm md:text-base">
                        Don&#39;t Miss Out
                    </p>
                </div>

                {implementedEvent.isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-64 bg-gray-200 animate-pulse rounded-3xl"
                            />
                        ))}
                    </div>
                ) : implementedData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-10 text-center px-4">
                        <p className="text-base md:text-lg font-semibold text-gray-700">
                            Belum ada kegiatan
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Nantikan event menarik lainnya 🚀
                        </p>
                    </div>
                ) : (
                    <div className="implemented-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-6 px-4">
                        {implementedData.map((event: EventResponse, i: number) => (
                            <div key={event.id ?? i} className="event-card-anim">
                                <CardEvent
                                    title={event.title}
                                    description={event?.description}
                                    image={getStorageUrl() + '/' + event.cover_image}
                                    date={event.start_date}
                                    tag={event.status}
                                    href={`/activity/${event.slug}`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative w-full mt-12 md:mt-16">
                <div className="upcoming-header">
                    <h1 className="text-xl md:text-2xl font-archivo">
                        Acara Mendatang
                    </h1>
                    <p className="text-secondary text-sm md:text-base">
                        Don&#39;t Miss Out
                    </p>
                </div>

                {upcomingEvent.isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-64 bg-gray-200 animate-pulse rounded-3xl"
                            />
                        ))}
                    </div>
                ) : upcomingData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-10 text-center px-4">
                        <p className="text-base md:text-lg font-semibold text-gray-700">
                            Belum ada kegiatan
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Nantikan event menarik lainnya 🚀
                        </p>
                    </div>
                ) : (
                    <div className="upcoming-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-6 px-4">
                        {upcomingData.map((event: EventResponse, i: number) => (
                            <div key={event.id ?? i} className="event-card-anim">
                                <CardEvent
                                    title={event.title}
                                    description={event.description}
                                    image={getStorageUrl() + '/' + event.cover_image}
                                    date={event.start_date}
                                    tag={event.status}
                                    href={`/activity/${event.slug}`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default ModulePortalActivityPage;