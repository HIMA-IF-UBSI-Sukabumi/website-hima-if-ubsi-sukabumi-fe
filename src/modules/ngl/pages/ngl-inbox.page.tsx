'use client'

import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthAxios } from "@/core/hooks/use-auth-axios";
import { useIsAuthenticated } from "@/core/stores/use-auth-store";
import {
    nglService,
    type NglMessageFilter,
    type NglMessageItem,
} from "@/modules/ngl/services/api/ngl.service";
import NglMailboxCard from "@/modules/ngl/components/NglMailboxCard";
import NglMessageModal from "@/modules/ngl/components/NglMessageModal";
import { getSsoLoginUrl } from "@/lib/utils";
import { FiInbox, FiLogIn, FiRefreshCw } from "react-icons/fi";

const FILTER_TABS: { value: NglMessageFilter; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "unread", label: "Belum Dibaca" },
    { value: "read", label: "Sudah Dibaca" },
];

const ModuleNglInboxPage = () => {
    const authAxios = useAuthAxios();
    const queryClient = useQueryClient();

    const { isLoggedIn, hasHydrated } = useIsAuthenticated();
    const [statusFilter, setStatusFilter] = useState<NglMessageFilter>("all");
    const [selectedMessage, setSelectedMessage] = useState<NglMessageItem | null>(null);

    const inboxQuery = useInfiniteQuery({
        queryKey: ["my-ngl-messages", statusFilter],
        queryFn: ({ pageParam }) =>
            nglService.findMyMessages(authAxios, {
                status: statusFilter,
                cursor: pageParam ?? undefined,
            }),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.next_cursor ?? null,
        enabled: isLoggedIn,
    });

    const markReadMutation = useMutation({
        mutationFn: (id: string) => nglService.markMyMessageRead(authAxios, id),
        onSuccess: (res) => {
            setSelectedMessage((prev) =>
                prev && prev.id === res.data.id ? res.data : prev
            );
            queryClient.invalidateQueries({ queryKey: ["my-ngl-messages"] });
        },
    });

    const handleOpenMessage = (msg: NglMessageItem) => {
        setSelectedMessage(msg);
        if (!msg.is_read) {
            markReadMutation.mutate(msg.id);
        }
    };

    const messages = inboxQuery.data?.pages.flatMap((page) => page.data) ?? [];

    if (!hasHydrated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-40 rounded-2xl bg-gray-200/70 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-xs space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <FiInbox className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Masuk untuk Melihat Inbox
                    </h1>
                    <p className="text-sm text-gray-600">
                        Gunakan akun SSO mahasiswa HIMA-IF untuk membaca pesan anonim yang dikirimkan kepada Anda.
                    </p>
                    <a
                        href={getSsoLoginUrl("ngl")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
                    >
                        <FiLogIn className="w-4 h-4" />
                        Masuk via SSO
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-archivo text-2xl text-gray-900">
                        Inbox Pesan Anonim
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Ketuk kotak surat untuk membuka pesan dan membalas ke media sosial.
                    </p>
                </div>

                <div className="inline-flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200/60">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setStatusFilter(tab.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                statusFilter === tab.value
                                    ? "bg-white text-primary shadow-xs"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {inboxQuery.isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="h-40 rounded-2xl bg-gray-200/70 animate-pulse"
                        />
                    ))}
                </div>
            ) : inboxQuery.isError ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-2xl border border-gray-100 text-center space-y-3">
                    <p className="text-sm text-gray-600">
                        Gagal memuat pesan. Silakan coba lagi.
                    </p>
                    <button
                        type="button"
                        onClick={() => inboxQuery.refetch()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
                    >
                        <FiRefreshCw className="w-3.5 h-3.5" />
                        Muat Ulang
                    </button>
                </div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 bg-white rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
                    <FiInbox className="w-8 h-8 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">
                        Belum ada pesan untuk kategori ini.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {messages.map((msg) => (
                            <NglMailboxCard
                                key={msg.id}
                                message={msg}
                                onOpen={handleOpenMessage}
                            />
                        ))}
                    </div>

                    {inboxQuery.hasNextPage && (
                        <div className="flex justify-center pt-2">
                            <button
                                type="button"
                                onClick={() => inboxQuery.fetchNextPage()}
                                disabled={inboxQuery.isFetchingNextPage}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:border-primary/40 transition cursor-pointer disabled:opacity-50"
                            >
                                {inboxQuery.isFetchingNextPage ? "Memuat..." : "Muat Lebih Banyak"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <NglMessageModal
                message={selectedMessage}
                onClose={() => setSelectedMessage(null)}
            />
        </div>
    );
};

export default ModuleNglInboxPage;
