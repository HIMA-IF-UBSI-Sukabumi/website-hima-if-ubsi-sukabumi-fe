'use client'

import {
    FiArrowLeft,
    FiCalendar,
    FiMapPin,
    FiClock,
    FiUsers,
    FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";
import {useQuery} from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import {eventService, RelatedEventResponse} from "@/modules/portal/services/api/event.service";
import {notFound} from "next/navigation";
import {formatTimestamp, formatDate, getStorageUrl} from "@/lib/utils";

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
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    approved: "bg-blue-100 text-blue-700 border border-blue-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
    published: "bg-green-100 text-green-700 border border-green-200",
};

const eventStatusConfig: Record<string, { label: string; emoji: string; className: string }> = {
    upcoming: {
        label: "Upcoming Event",
        emoji: "🚀",
        className: "bg-primary text-white",
    },
    ongoing: {
        label: "Sedang Berlangsung",
        emoji: "🔥",
        className: "bg-green-500 text-white",
    },
    past: {
        label: "Selesai",
        emoji: "✅",
        className: "bg-smoky text-secondary border border-gray-200",
    },
};

const ModulePortalEventDetailPage = ({slug}: EventDetailPageProps) => {
    const axios = useAxios();
    const storageUrl = getStorageUrl();

    const event = useQuery({
        queryKey: ["detail-event", slug],
        queryFn: async () => await eventService.findBySlug(axios, slug),
    });

    const eventData = event.data?.event;

    if (event.isLoading) {
        return (
            <section className="mt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                {/* Back button skeleton */}
                <div className="h-4 w-44 bg-gray-200 rounded-full mb-10"/>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main content skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex gap-2">
                            <div className="h-6 w-28 bg-gray-200 rounded-full"/>
                            <div className="h-6 w-24 bg-gray-200 rounded-full"/>
                        </div>
                        <div className="space-y-3">
                            <div className="h-8 w-4/5 bg-gray-200 rounded-lg"/>
                            <div className="h-8 w-1/2 bg-gray-200 rounded-lg"/>
                        </div>
                        <div className="w-full aspect-video bg-gray-200 rounded-3xl"/>
                        <div className="space-y-3 pt-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded" style={{width: `${85 - i * 8}%`}}/>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar skeleton */}
                    <div className="lg:col-span-1 space-y-5">
                        <div className="p-6 bg-white border rounded-3xl space-y-5">
                            <div className="h-5 w-28 bg-gray-200 rounded"/>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0"/>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 w-16 bg-gray-200 rounded"/>
                                        <div className="h-4 w-3/4 bg-gray-200 rounded"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="h-12 w-full bg-gray-200 rounded-2xl"/>
                        <div className="space-y-4">
                            <div className="h-5 w-28 bg-gray-200 rounded"/>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex-shrink-0"/>
                                    <div className="flex-1 space-y-2 pt-1">
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

    const isSameDay = startDate.toDateString() === endDate.toDateString();
    const relatedEvents = eventData.related_events ?? [];
    const currentStatusConfig = eventStatusConfig[eventStatus];

    return (
        <section className="mt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Back button */}
            <Link
                href="/activity"
                className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-all duration-200 font-medium text-sm mb-10 group"
            >
                <span className="w-7 h-7 rounded-full bg-smoky flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200">
                    <FiArrowLeft className="w-3.5 h-3.5"/>
                </span>
                Kembali ke Kegiatan
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* ── Main Content ── */}
                <div className="lg:col-span-2">

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full ${currentStatusConfig.className}`}>
                            <span>{currentStatusConfig.emoji}</span>
                            {currentStatusConfig.label}
                        </span>
                        <span className={`inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-full ${statusColor[eventData.status] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                            {statusLabel[eventData.status] ?? eventData.status}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-archivo font-bold text-black leading-tight mb-6">
                        {eventData.title}
                    </h1>

                    {/* Cover Image */}
                    <div className="rounded-3xl overflow-hidden shadow-lg group">
                        <img
                            src={`${storageUrl}/${eventData.cover_image}`}
                            alt={eventData.title}
                            className="w-full h-auto max-h-[80vh] object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                        />
                    </div>

                    {/* Description */}
                    {eventData.description && (
                        <div className="mt-8 bg-white rounded-3xl border border-smoky p-6 sm:p-8 shadow-sm">
                            <div
                                className="prose prose-sm max-w-none text-justify leading-relaxed"
                                dangerouslySetInnerHTML={{__html: eventData.description}}
                            />
                        </div>
                    )}
                </div>

                {/* ── Sidebar ── */}
                <div className="lg:col-span-1">
                    <div className="sticky top-36 space-y-5">

                        {/* Event Detail Card */}
                        <div className="bg-white rounded-3xl border border-smoky shadow-sm overflow-hidden">
                            {/* Card header accent */}
                            <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/40"/>
                            <div className="p-6 space-y-5">
                                <h2 className="text-base font-black text-black">Detail Acara</h2>

                                {/* Date */}
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FiCalendar className="w-4 h-4 text-primary"/>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                                            Tanggal
                                        </p>
                                        <p className="text-sm font-semibold text-black">
                                            {formatDate(eventData.start_date)}
                                        </p>
                                        {!isSameDay && (
                                            <p className="text-xs text-secondary mt-0.5">
                                                s/d {formatDate(eventData.end_date)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                {eventData.location && (
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FiMapPin className="w-4 h-4 text-primary"/>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                                                Lokasi
                                            </p>
                                            <p className="text-sm font-semibold text-black">
                                                {eventData.location}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Published at */}
                                {eventData.published_at && (
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FiClock className="w-4 h-4 text-primary"/>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                                                Dipublikasikan
                                            </p>
                                            <p className="text-sm font-semibold text-black">
                                                {formatTimestamp(eventData.published_at)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA Button */}
                        {eventStatus === "upcoming" && eventData.form_link && (
                            <a
                                href={eventData.form_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl hover:bg-primary/90 active:scale-95 transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                            >
                                <FiUsers className="w-4 h-4"/>
                                Daftar Sekarang
                            </a>
                        )}

                        {/* Related Events */}
                        <div className="bg-white rounded-3xl border border-smoky shadow-sm p-6">
                            <h2 className="text-base font-black text-black mb-4">
                                Acara Lainnya
                            </h2>

                            <div className="flex flex-col gap-2">
                                {relatedEvents.length > 0 ? (
                                    relatedEvents.map((item: RelatedEventResponse) => (
                                        <Link
                                            key={item.id}
                                            href={`/activity/${item.current_slug}`}
                                            className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-smoky transition-all duration-200"
                                        >
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                                                <img
                                                    src={`${storageUrl}/${item.cover_image}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    alt={item.title}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-black line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <FiChevronRight className="w-4 h-4 text-secondary flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"/>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                        <div className="w-12 h-12 rounded-2xl bg-smoky flex items-center justify-center mb-3">
                                            <FiCalendar className="w-5 h-5 text-secondary"/>
                                        </div>
                                        <p className="text-sm text-secondary font-medium">
                                            Belum ada acara lain
                                        </p>
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