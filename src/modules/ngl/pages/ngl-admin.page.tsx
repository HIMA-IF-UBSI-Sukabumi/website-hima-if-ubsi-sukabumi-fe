'use client'

import { useState } from "react";
import Link from "next/link";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthAxios } from "@/core/hooks/use-auth-axios";
import { useAuthStore, useIsAuthenticated } from "@/core/stores/use-auth-store";
import { nglService, type NglMessageFilter } from "@/modules/ngl/services/api/ngl.service";
import NglMessageCard from "@/modules/ngl/components/NglMessageCard";
import { getSsoLoginUrl } from "@/lib/utils";
import { FiInbox, FiLogIn, FiRefreshCw, FiShield } from "react-icons/fi";

const FILTER_TABS: { value: NglMessageFilter; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "unread", label: "Belum Dibaca" },
    { value: "read", label: "Sudah Dibaca" },
];

const ModuleNglAdminPage = () => {
    const authAxios = useAuthAxios();
    const queryClient = useQueryClient();

    const user = useAuthStore((s) => s.user);
    const { isLoggedIn, hasHydrated } = useIsAuthenticated();
    const isAdmin = isLoggedIn && Boolean(user?.roles?.includes("admin"));

    const [statusFilter, setStatusFilter] = useState<NglMessageFilter>("all");
    const [markingId, setMarkingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const adminQuery = useInfiniteQuery({
        queryKey: ["admin-ngl-messages", statusFilter],
        queryFn: ({ pageParam }) =>
            nglService.findAdminMessages(authAxios, {
                status: statusFilter,
                cursor: pageParam ?? undefined,
            }),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.next_cursor ?? null,
        enabled: isAdmin,
    });

    const markReadMutation = useMutation({
        mutationFn: (id: string) => nglService.markAdminMessageRead(authAxios, id),
        onMutate: (id) => setMarkingId(id),
        onSettled: () => setMarkingId(null),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-ngl-messages"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => nglService.deleteAdminMessage(authAxios, id),
        onMutate: (id) => setDeletingId(id),
        onSettled: () => setDeletingId(null),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-ngl-messages"] });
        },
    });

    const messages = adminQuery.data?.pages.flatMap((page) => page.data) ?? [];

    if (!hasHydrated) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-32 rounded-2xl bg-gray-200/70 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-xs space-y-4">
                    <FiShield className="w-10 h-10 text-primary mx-auto" />
                    <h1 className="text-xl font-bold text-gray-900">
                        Autentikasi Diperlukan
                    </h1>
                    <p className="text-sm text-gray-600">
                        Silakan masuk menggunakan akun admin melalui SSO HIMA-IF.
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

    if (!isAdmin) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-xs space-y-4">
                    <FiShield className="w-10 h-10 text-red-500 mx-auto" />
                    <h1 className="text-xl font-bold text-gray-900">
                        Akses Ditolak
                    </h1>
                    <p className="text-sm text-gray-600">
                        Halaman ini hanya dapat diakses oleh pengurus dengan role admin.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                        <FiShield className="w-3.5 h-3.5" />
                        Panel Admin
                    </span>
                    <h1 className="font-archivo text-2xl text-gray-900">
                        Moderasi Pesan Umum NGL
                    </h1>
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
                                    : "text-gray-600 hover:text-gray-900:text-zinc-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {adminQuery.isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-32 rounded-2xl bg-gray-200/70 animate-pulse"
                        />
                    ))}
                </div>
            ) : adminQuery.isError ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-2xl border border-gray-100 text-center space-y-3">
                    <p className="text-sm text-gray-600">
                        Gagal memuat pesan admin. Silakan coba lagi.
                    </p>
                    <button
                        type="button"
                        onClick={() => adminQuery.refetch()}
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
                        Belum ada pesan umum untuk kategori ini.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <NglMessageCard
                            key={msg.id}
                            message={msg}
                            onMarkRead={(id) => markReadMutation.mutate(id)}
                            onDelete={(id) => deleteMutation.mutate(id)}
                            isMarkingRead={markingId === msg.id}
                            isDeleting={deletingId === msg.id}
                        />
                    ))}

                    {adminQuery.hasNextPage && (
                        <div className="flex justify-center pt-2">
                            <button
                                type="button"
                                onClick={() => adminQuery.fetchNextPage()}
                                disabled={adminQuery.isFetchingNextPage}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:border-primary/40 transition cursor-pointer disabled:opacity-50"
                            >
                                {adminQuery.isFetchingNextPage ? "Memuat..." : "Muat Lebih Banyak"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ModuleNglAdminPage;
