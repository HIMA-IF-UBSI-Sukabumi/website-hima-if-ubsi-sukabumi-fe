'use client'

import { formatTimestampWithTime } from "@/lib/utils";
import type { NglMessageItem } from "@/modules/ngl/services/api/ngl.service";
import { FiClock, FiMail } from "react-icons/fi";
import { HiOutlineEnvelopeOpen } from "react-icons/hi2";

interface NglMailboxCardProps {
    message: NglMessageItem;
    onOpen: (message: NglMessageItem) => void;
}

const NglMailboxCard = ({ message, onOpen }: NglMailboxCardProps) => {
    const isUnread = !message.is_read;

    return (
        <button
            type="button"
            onClick={() => onOpen(message)}
            className={`group w-full text-left rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
                isUnread
                    ? "bg-gradient-to-br from-indigo-50/90 via-white to-smoky/50 border-primary/35 shadow-xs hover:shadow-md hover:border-primary/60"
                    : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-xs"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isUnread
                            ? "bg-primary text-white shadow-xs"
                            : "bg-gray-100 text-gray-500"
                    }`}
                >
                    {isUnread ? (
                        <FiMail className="w-6 h-6" />
                    ) : (
                        <HiOutlineEnvelopeOpen className="w-6 h-6" />
                    )}
                </div>

                {isUnread ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Pesan Baru
                    </span>
                ) : (
                    <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                        Sudah Dibaca
                    </span>
                )}
            </div>

            <div className="space-y-1">
                <p
                    className={`text-sm font-bold ${
                        isUnread
                            ? "text-gray-900 group-hover:text-primary"
                            : "text-gray-700"
                    } transition`}
                >
                    {isUnread ? "Ketuk untuk membuka surat" : "Lihat isi pesan"}
                </p>
                <p className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                    <FiClock className="w-3 h-3" />
                    {formatTimestampWithTime(message.created_at)}
                </p>
            </div>
        </button>
    );
};

export default NglMailboxCard;
