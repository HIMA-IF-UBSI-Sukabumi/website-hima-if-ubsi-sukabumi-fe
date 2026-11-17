'use client'

import { useQuery } from "@tanstack/react-query";
import { useAuthAxios } from "@/core/hooks/use-auth-axios";
import { useAuthStore, useIsAuthenticated } from "@/core/stores/use-auth-store";
import { electionsService } from "@/modules/elections/services/api/elections.service";
import ElectionCard from "@/modules/elections/components/ElectionCard";
import { getSsoLoginUrl } from "@/lib/utils";
import { FiCheckSquare, FiInbox, FiLogIn, FiRefreshCw, FiShield } from "react-icons/fi";

const ModuleElectionsListPage = () => {
    const authAxios = useAuthAxios();
    const user = useAuthStore((s) => s.user);
    const { isLoggedIn, hasHydrated } = useIsAuthenticated();

    const myElectionsQuery = useQuery({
        queryKey: ["my-elections"],
        queryFn: () => electionsService.findMyElections(authAxios),
        enabled: isLoggedIn,
    });

    const myElections = myElectionsQuery.data?.elections ?? [];

    if (!hasHydrated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="h-64 rounded-3xl bg-gray-200/70 animate-pulse" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="max-w-xl mx-auto px-4 py-14 sm:py-20">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 text-center shadow-sm space-y-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <FiShield className="w-7 h-7" />
                    </div>

                    <div className="space-y-2">
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
                            HIMA-IF SuaraMu
                        </span>
                        <h1 className="font-archivo text-2xl sm:text-3xl text-gray-900">
                            Masuk ke Bilik Suara Digital
                        </h1>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Silakan masuk menggunakan akun SSO mahasiswa HIMA-IF UBSI PSDKU Sukabumi
                            untuk melihat daftar pemilihan yang tersedia dan menyalurkan hak suaramu.
                        </p>
                    </div>

                    <div className="pt-2">
                        <a
                            href={getSsoLoginUrl("elections")}
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition shadow-xs"
                        >
                            <FiLogIn className="w-4 h-4" />
                            Masuk via SSO HIMA-IF
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
            {/* Welcome Banner */}
            <section className="rounded-3xl bg-primary text-white p-7 sm:p-9 shadow-sm">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-white mb-3">
                    <FiShield className="w-3.5 h-3.5" />
                    E-Voting Resmi HIMA-IF
                </span>
                <h1 className="font-archivo text-2xl sm:text-3xl leading-tight">
                    Halo, {user?.name ?? "Pemilih"}!
                </h1>
                <p className="text-sm text-white/80 mt-1.5 max-w-2xl">
                    Pilih pemilu di bawah ini untuk melihat profil paslon, visi &amp; misi,
                    serta memberikan suaramu secara rahasia.
                </p>
            </section>

            {/* My Eligible Elections */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <FiCheckSquare className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold text-gray-900">
                        Pemilu Anda
                    </h2>
                </div>

                {myElectionsQuery.isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-52 rounded-2xl bg-gray-200/70 animate-pulse"
                            />
                        ))}
                    </div>
                ) : myElectionsQuery.isError ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-2xl border border-gray-100 text-center space-y-3">
                        <p className="text-sm text-gray-600">
                            Gagal memuat daftar pemilu Anda. Silakan coba lagi.
                        </p>
                        <button
                            type="button"
                            onClick={() => myElectionsQuery.refetch()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
                        >
                            <FiRefreshCw className="w-3.5 h-3.5" />
                            Muat Ulang
                        </button>
                    </div>
                ) : myElections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {myElections.map((election) => (
                            <ElectionCard
                                key={election.id}
                                election={election}
                                voterStatus={election.voter_status}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-14 px-6 bg-white rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
                        <FiInbox className="w-8 h-8 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">
                            Anda belum terdaftar sebagai pemilih pada pemilu yang aktif atau selesai.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ModuleElectionsListPage;
