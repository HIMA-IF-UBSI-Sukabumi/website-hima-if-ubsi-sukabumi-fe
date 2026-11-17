'use client'

import { formatTimestamp } from "@/lib/utils";
import type { NglMessageItem } from "@/modules/ngl/services/api/ngl.service";
import { FiCheck, FiClock, FiTrash2 } from "react-icons/fi";

interface NglMessageCardProps {
    message: NglMessageItem;
    onMarkRead?: (id: string) => void;
    onDelete?: (id: string) => void;
    isMarkingRead?: boolean;
    isDeleting?: boolean;
}

const NglMessageCard = ({
    message,
    onMarkRead,
    onDelete,
    isMarkingRead,
    isDeleting,
}: NglMessageCardProps) => {
    return (
        <article
            className={`rounded-2xl border p-5 transition-all ${
                message.is_read
                    ? "bg-white border-gray-100"
                    : "bg-indigo-50/50 border-primary/30 shadow-xs"
            }`}
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    {!message.is_read ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Baru
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            Sudah Dibaca
                        </span>
                    )}
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                    <FiClock className="w-3 h-3" />
                    {formatTimestamp(message.created_at)}
                </span>
            </div>

            <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
            </p>

            {(onMarkRead || onDelete) && (
                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                    {!message.is_read && onMarkRead && (
                        <button
                            type="button"
                            disabled={isMarkingRead}
                            onClick={() => onMarkRead(message.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition cursor-pointer disabled:opacity-50"
                        >
                            <FiCheck className="w-3.5 h-3.5" />
                            <span>{isMarkingRead ? "Memproses..." : "Tandai Dibaca"}</span>
                        </button>
                    )}

                    {onDelete && (
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => onDelete(message.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100:bg-red-900/50 transition cursor-pointer disabled:opacity-50"
                        >
                            <FiTrash2 className="w-3.5 h-3.5" />
                            <span>{isDeleting ? "Menghapus..." : "Hapus"}</span>
                        </button>
                    )}
                </div>
            )}
        </article>
    );
};

export default NglMessageCard;
