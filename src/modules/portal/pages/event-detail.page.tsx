'use client'

import {FiArrowLeft, FiCalendar, FiMapPin, FiClock, FiUsers} from "react-icons/fi";
import Link from "next/link";
import {dummyEvents} from "@/constants/dummy-events";
import {formatTimestamp, formatDate} from "@/lib/utils";
import {notFound} from "next/navigation";

type EventDetailPageProps = {
    slug: string;
}

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
    const event = dummyEvents.find((e) => (e.slug ?? e.id) === slug);

    if (!event) {
        notFound();
    }

    const otherEvents = dummyEvents
        .filter((e) => (e.slug ?? e.id) !== slug)
        .slice(0, 3);

    const isUpcoming = !event.is_implemented;

    const isSameDay = event.start_date === event.end_date;

    return (
        <section className="mt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
                href="/activity"
                className="inline-flex items-center gap-2 text-secondary hover:text-primary transition font-medium text-sm mb-8"
            >
                <FiArrowLeft className="w-4 h-4"/>
                Kembali ke Kegiatan
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Status & Tag */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span
                            className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                                isUpcoming
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {isUpcoming ? '🚀 Upcoming Event' : '✅ Terlaksana'}
                        </span>
                        <span
                            className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${statusColor[event.status] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                            {statusLabel[event.status] ?? event.status}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-archivo font-black text-black leading-tight">
                        {event.title}
                    </h1>

                    {/* Cover Image */}
                    <div className="mt-6 rounded-3xl overflow-hidden border border-smoky shadow-md">
                        <img
                            src={event.cover_image
                                ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${event.cover_image}`
                                : `https://picsum.photos/seed/${event.id ?? event.slug}/900/500`}
                            alt={event.title}
                            className="w-full h-64 sm:h-80 md:h-96 object-cover"
                        />
                    </div>

                    {/* Description */}
                    {event.description && (
                        <div className="mt-8">
                            <h2 className="text-lg font-bold text-black mb-3">Tentang Acara</h2>
                            <p className="text-gray-600 leading-relaxed text-base">
                                {event.description}
                            </p>
                        </div>
                    )}

                    {/* Gallery (placeholder jika ada) */}
                    {event.galler_image && event.galler_image.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-lg font-bold text-black mb-3">Galeri Foto</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {event.galler_image.map((img, i) => (
                                    <div key={i} className="rounded-2xl overflow-hidden aspect-square">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${img}`}
                                            alt={`Gallery ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-36 space-y-4">
                        {/* Info Card */}
                        <div className="bg-white rounded-3xl border border-smoky shadow-sm p-6 space-y-5">
                            <h2 className="text-base font-black text-black">Detail Acara</h2>

                            {/* Date */}
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-smoky flex items-center justify-center flex-shrink-0">
                                    <FiCalendar className="w-4 h-4 text-primary"/>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                                        Tanggal
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatDate(event.start_date)}
                                    </p>
                                    {!isSameDay && (
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            s/d {formatDate(event.end_date)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            {event.location && (
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-smoky flex items-center justify-center flex-shrink-0">
                                        <FiMapPin className="w-4 h-4 text-primary"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                                            Lokasi
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {event.location}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Published at */}
                            {event.published_at && (
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-smoky flex items-center justify-center flex-shrink-0">
                                        <FiClock className="w-4 h-4 text-primary"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                                            Dipublikasikan
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatTimestamp(event.published_at)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTA Button if upcoming */}
                        {isUpcoming && (
                            <button
                                className="w-full bg-primary text-white font-bold py-3 rounded-2xl hover:bg-primary/90 transition text-sm flex items-center justify-center gap-2"
                            >
                                <FiUsers className="w-4 h-4"/>
                                Daftar Sekarang
                            </button>
                        )}

                        {/* Other Events */}
                        <div>
                            <h2 className="text-base font-black text-black mb-3">
                                Acara Lainnya
                            </h2>
                            <div className="flex flex-col gap-3">
                                {otherEvents.map((item) => (
                                    <Link
                                        key={item.id ?? item.slug}
                                        href={`/activity/${item.slug ?? item.id}`}
                                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-smoky transition group"
                                    >
                                        <div className="w-14 h-14 min-w-14 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.cover_image
                                                    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.cover_image}`
                                                    : `https://picsum.photos/seed/${item.id ?? item.slug}/200/200`}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span
                                                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                                                    !item.is_implemented
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {!item.is_implemented ? 'Upcoming' : 'Terlaksana'}
                                            </span>
                                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
                                                <FiCalendar className="w-3 h-3"/>
                                                <span>{formatTimestamp(item.start_date)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <Link
                                href="/activity"
                                className="mt-4 block text-center text-sm font-semibold text-primary hover:underline"
                            >
                                Lihat semua kegiatan →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModulePortalEventDetailPage;
