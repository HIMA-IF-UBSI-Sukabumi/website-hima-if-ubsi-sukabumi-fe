'use client'

import { useRef } from "react";
import {
    FiArrowLeft,
    FiCalendar,
    FiMapPin,
    FiClock,
    FiUsers
} from "react-icons/fi";
import Link from "next/link";
import {useQuery} from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import {eventService, RelatedEventResponse} from "@/modules/portal/services/api/event.service";
import {notFound} from "next/navigation";
import {formatTimestamp, formatDate, getStorageUrl} from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type EventDetailPageProps = {
    slug: string;
};

const statusLabel: Record<string, string> = {
    pending: "Menunggu Persetujuan",
    approved: "Disetujui",
    rejected: "Ditolak",
    published: "Dipublikasikan",
};

const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    published: "bg-green-100 text-green-700",
};

const ModulePortalEventDetailPage = ({slug}: EventDetailPageProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const axios = useAxios();
    const storageUrl = getStorageUrl();

    const event = useQuery({
        queryKey: ["detail-event", slug],
        queryFn: async () => await eventService.findBySlug(axios, slug),
    });

    const eventData = event.data?.event;

    useGSAP(() => {
        if (!eventData) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (document.querySelector(".back-link")) {
            tl.from(".back-link", {
                opacity: 0,
                x: -20,
                duration: 0.6
            });
        }

        if (document.querySelector(".detail-badge")) {
            tl.from(".detail-badge", {
                opacity: 0,
                y: 10,
                stagger: 0.1,
                duration: 0.5
            }, "-=0.4");
        }

        if (document.querySelector(".detail-title")) {
            tl.from(".detail-title", {
                opacity: 0,
                y: 20,
                duration: 0.6
            }, "-=0.4");
        }

        if (document.querySelector(".detail-image-wrapper")) {
            tl.from(".detail-image-wrapper", {
                opacity: 0,
                y: 30,
                duration: 0.8
            }, "-=0.4");
        }

        if (document.querySelector(".detail-description")) {
            tl.from(".detail-description", {
                opacity: 0,
                y: 25,
                duration: 0.8
            }, "-=0.5");
        }

        if (document.querySelector(".detail-info-card")) {
            tl.from(".detail-info-card", {
                opacity: 0,
                y: 30,
                duration: 0.8
            }, "-=0.8");
        }

        if (document.querySelector(".detail-register-btn")) {
            tl.from(".detail-register-btn", {
                opacity: 0,
                y: 20,
                duration: 0.6
            }, "-=0.5");
        }

        if (document.querySelector(".related-events-section")) {
            tl.from(".related-events-section", {
                opacity: 0,
                y: 30,
                duration: 0.8
            }, "-=0.6");
        }
    }, { scope: containerRef, dependencies: [eventData?.id] });

    if (event.isLoading) {
        return (
            <section className="mt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">

                <div className="h-4 w-40 bg-gray-200 rounded mb-8"/>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">

                        <div className="flex gap-2">
                            <div className="h-6 w-24 bg-gray-200 rounded-full"/>
                            <div className="h-6 w-28 bg-gray-200 rounded-full"/>
                        </div>

                        <div className="space-y-2">
                            <div className="h-6 md:h-8 w-3/4 bg-gray-200 rounded"/>
                            <div className="h-6 md:h-8 w-1/2 bg-gray-200 rounded"/>
                        </div>

                        <div className="h-64 sm:h-80 md:h-96 bg-gray-200 rounded-3xl"/>

                        <div className="space-y-3 mt-6">
                            <div className="h-4 w-full bg-gray-200 rounded"/>
                            <div className="h-4 w-5/6 bg-gray-200 rounded"/>
                            <div className="h-4 w-2/3 bg-gray-200 rounded"/>
                            <div className="h-4 w-4/5 bg-gray-200 rounded"/>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">

                        <div className="p-6 bg-white border rounded-3xl space-y-4">
                            <div className="h-5 w-32 bg-gray-200 rounded"/>

                            <div className="space-y-4">
                                <div className="h-4 w-full bg-gray-200 rounded"/>
                                <div className="h-4 w-2/3 bg-gray-200 rounded"/>
                                <div className="h-4 w-3/4 bg-gray-200 rounded"/>
                            </div>
                        </div>

                        <div className="h-10 w-full bg-gray-200 rounded-2xl"/>

                        <div className="space-y-3">
                            <div className="h-5 w-32 bg-gray-200 rounded"/>

                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-14 h-14 bg-gray-200 rounded-xl"/>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 bg-gray-200 rounded"/>
                                        <div className="h-3 w-1/2 bg-gray-200 rounded"/>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>
        );
    }

    if (!eventData) {
        notFound();
    }

    const now = new Date();
    const startDate = new Date(eventData.start_date);
    const endDate = new Date(eventData.end_date);

    const eventStatus =
        endDate < now
            ? "past"
            : startDate <= now && endDate >= now
                ? "ongoing"
                : "upcoming";

    const isSameDay =
        startDate.toDateString() === endDate.toDateString();

    const relatedEvents = eventData.related_events ?? [];

    return (
        <section ref={containerRef} className="mt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
                href="/activity"
                className="back-link inline-flex items-center gap-2 text-secondary hover:text-primary transition font-medium text-sm mb-8"
            >
                <FiArrowLeft className="w-4 h-4"/>
                Kembali ke Kegiatan
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <div className="flex flex-wrap gap-2 mb-4">

                        {eventStatus === "upcoming" && (
                            <span
                                className="detail-badge inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-primary text-white">
                                🚀 Upcoming Event
                            </span>
                        )}

                        {eventStatus === "ongoing" && (
                            <span
                                className="detail-badge inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-green-500 text-white">
                                🔥 Sedang Berlangsung
                            </span>
                        )}

                        {eventStatus === "past" && (
                            <span
                                className="detail-badge inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-gray-200 text-gray-700">
                                ✅ Selesai
                            </span>
                        )}

                        <span
                            className={`detail-badge inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                                statusColor[eventData.status] ??
                                "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {statusLabel[eventData.status] ?? eventData.status}
                        </span>

                    </div>

                    <h1 className="detail-title text-xl sm:text-2xl md:text-3xl font-archivo font-bold text-black leading-tight">
                        {eventData.title}
                    </h1>

                    <div className="detail-image-wrapper mt-6 rounded-3xl overflow-hidden border shadow-md">
                        <img
                            src={`${storageUrl}/${eventData.cover_image}`}
                            alt={eventData.title}
                            className="w-full h-64 sm:h-80 md:h-96 object-cover"
                        />
                    </div>

                    {eventData.description && (
                        <div className="detail-description mt-8">
                            <div
                                className="prose prose-sm max-w-none text-justify"
                                dangerouslySetInnerHTML={{
                                    __html: eventData.description,
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-36 space-y-4">
                        <div className="detail-info-card bg-white rounded-3xl border border-smoky shadow-sm p-6 space-y-5">
                            <h2 className="text-base font-black text-black">Detail Acara</h2>
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-9 h-9 rounded-xl bg-smoky flex items-center justify-center flex-shrink-0">
                                    <FiCalendar className="w-4 h-4 text-primary"/>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                                        Tanggal
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatDate(eventData.start_date)}
                                    </p>
                                    {!isSameDay && (
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            s/d {formatDate(eventData.end_date)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {eventData.location && (
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-9 h-9 rounded-xl bg-smoky flex items-center justify-center flex-shrink-0">
                                        <FiMapPin className="w-4 h-4 text-primary"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                                            Lokasi
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {eventData.location}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {eventData.published_at && (
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-9 h-9 rounded-xl bg-smoky flex items-center justify-center flex-shrink-0">
                                        <FiClock className="w-4 h-4 text-primary"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                                            Dipublikasikan
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatTimestamp(eventData.published_at)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {eventStatus === "upcoming" &&
                            eventData.form_link && (
                                <a
                                    href={eventData.form_link}
                                    target="_blank"
                                    className="detail-register-btn w-full bg-primary text-white font-bold py-3 rounded-2xl hover:bg-primary/90 transition text-sm flex items-center justify-center gap-2"
                                >
                                    <FiUsers className="w-4 h-4"/>
                                    Daftar Sekarang
                                </a>
                            )}

                        <div className="related-events-section">
                            <h2 className="text-base font-black mb-3">
                                Acara Lainnya
                            </h2>

                            <div className="flex flex-col gap-3">
                                {relatedEvents.length > 0 ? (
                                    relatedEvents.map((item: RelatedEventResponse) => (
                                        <Link
                                            key={item.id}
                                            href={`/activity/${item.current_slug}`}
                                            className="flex gap-3 p-3 rounded-2xl hover:bg-smoky transition"
                                        >
                                            <div className="w-14 h-14 rounded-xl overflow-hidden">
                                                <img
                                                    src={`${storageUrl}/${item.cover_image}`}
                                                    className="w-full h-full object-cover"
                                                    alt={item.title}
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold line-clamp-2">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div
                                        className="bg-white text-sm text-center rounded-3xl border border-smoky shadow-sm p-6 space-y-5">
                                        Belum ada acara lain yang terkait
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModulePortalEventDetailPage;