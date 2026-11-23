'use client'

import SocialMediaIcons from "@/components/social-media-icons";
import { getNglUrl, resolveImageUrl } from "@/lib/utils";
import { useSharePage } from "@/modules/talents/hooks/use-share-page";
import type {
    TalentOrganizationItem,
    TalentProfile,
} from "@/modules/talents/services/api/talent.service";
import { FiCheck, FiMessageCircle, FiShare2 } from "react-icons/fi";

interface SectionAnchor {
    id: string;
    label: string;
}

interface TalentHeroCardProps {
    profile: TalentProfile;
    activeOrg?: TalentOrganizationItem;
    sectionAnchors: SectionAnchor[];
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    aktif: {
        label: "Mahasiswa Aktif",
        className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    },
    alumni: {
        label: "Alumni",
        className: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    },
};

const TalentHeroCard = ({
    profile,
    activeOrg,
    sectionAnchors,
}: TalentHeroCardProps) => {
    const { share, copied } = useSharePage();
    const avatarUrl = resolveImageUrl(profile.avatar);
    const initials = profile.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    const statusBadge = profile.status ? STATUS_BADGE[profile.status] : null;

    return (
        <section className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="h-24 sm:h-32 bg-primary relative">
                <div
                    className="absolute inset-x-0 bottom-0 h-1 bg-secondary"
                    aria-hidden="true"
                />
            </div>

            <div className="px-5 sm:px-8 pb-7 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={`Foto profil ${profile.name}`}
                                width={120}
                                height={120}
                                fetchPriority="high"
                                className="-mt-16 sm:-mt-20 w-24 h-24 sm:w-30 sm:h-30 rounded-2xl object-cover border-4 border-white shadow-sm bg-white shrink-0"
                            />
                        ) : (
                            <div
                                aria-hidden="true"
                                className="-mt-16 sm:-mt-20 w-24 h-24 sm:w-30 sm:h-30 rounded-2xl border-4 border-white shadow-sm bg-primary text-white font-archivo text-2xl sm:text-3xl flex items-center justify-center shrink-0"
                            >
                                {initials || "IF"}
                            </div>
                        )}

                        <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                {statusBadge && (
                                    <span
                                        className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-md ${statusBadge.className}`}
                                    >
                                        {statusBadge.label}
                                    </span>
                                )}
                                <span className="text-xs font-mono font-medium text-gray-600">
                                    NIM {profile.nim}
                                </span>
                                {activeOrg && (
                                    <span className="text-xs font-medium text-primary">
                                        &bull;{" "}
                                        {[activeOrg.jabatan, activeOrg.departemen]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </span>
                                )}
                            </div>

                            <h1 className="font-archivo text-2xl sm:text-3xl text-gray-900 tracking-tight break-words">
                                {profile.name}
                            </h1>

                            {profile.headline && (
                                <p className="text-sm sm:text-base font-medium text-gray-700">
                                    {profile.headline}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <SocialMediaIcons links={profile.social_links} />

                        {profile.nim && (
                            <a
                                href={getNglUrl(`/${profile.nim}`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-xs focus-visible:outline-2 focus-visible:outline-primary"
                            >
                                <FiMessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Kirim Pesan</span>
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                share({
                                    title: `${profile.name} | HIMA-IF Portfolio`,
                                    text:
                                        profile.headline ||
                                        `Lihat portofolio ${profile.name} di HIMA-IF UBSI PSDKU Sukabumi`,
                                })
                            }
                            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-800 hover:border-primary hover:text-primary transition cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                                    <span className="text-emerald-700">Tautan Tersalin</span>
                                </>
                            ) : (
                                <>
                                    <FiShare2 className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Bagikan</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {sectionAnchors.length > 1 && (
                    <nav
                        aria-label="Navigasi bagian portofolio"
                        className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1"
                    >
                        {sectionAnchors.map((anchor) => (
                            <a
                                key={anchor.id}
                                href={`#${anchor.id}`}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100/80 hover:bg-primary/10 hover:text-primary transition whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary"
                            >
                                {anchor.label}
                            </a>
                        ))}
                    </nav>
                )}
            </div>
        </section>
    );
};

export default TalentHeroCard;
