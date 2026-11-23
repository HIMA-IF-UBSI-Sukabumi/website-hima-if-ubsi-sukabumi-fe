import type {
    TalentOrganizationItem,
    TalentProfile,
} from "@/modules/talents/services/api/talent.service";
import { FiUsers } from "react-icons/fi";

interface TalentSidebarProps {
    profile: TalentProfile;
    organizationHistory: TalentOrganizationItem[];
    counts: {
        projects: number;
        achievements: number;
        certificates: number;
        committees: number;
    };
    hasMainContent: boolean;
}

const TalentSidebar = ({
    profile,
    organizationHistory,
    counts,
    hasMainContent,
}: TalentSidebarProps) => {
    const summaryItems = [
        { label: "Proyek", value: counts.projects },
        { label: "Prestasi", value: counts.achievements },
        { label: "Sertifikat", value: counts.certificates },
        { label: "Kepanitiaan", value: counts.committees },
    ];

    return (
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {(profile.bio || profile.skills.length > 0) && (
                <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 space-y-5">
                    {profile.bio && (
                        <div className="space-y-2">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Tentang
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {profile.skills.length > 0 && (
                        <div
                            className={
                                profile.bio
                                    ? "pt-4 border-t border-gray-100 space-y-2.5"
                                    : "space-y-2.5"
                            }
                        >
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Keahlian
                            </h2>
                            <ul className="flex flex-wrap gap-1.5">
                                {profile.skills.map((skill) => (
                                    <li
                                        key={skill}
                                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 border border-gray-200/70"
                                    >
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}

            {hasMainContent && (
                <section
                    aria-label="Ringkasan portofolio"
                    className="bg-white rounded-2xl border border-gray-200/80 p-5 grid grid-cols-2 gap-4"
                >
                    {summaryItems.map((item) => (
                        <div key={item.label}>
                            <p className="text-xs text-gray-500">{item.label}</p>
                            <p className="font-archivo text-2xl text-gray-900 mt-0.5">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </section>
            )}

            {organizationHistory.length > 0 && (
                <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 space-y-4">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <FiUsers className="w-4 h-4 text-primary" aria-hidden="true" />
                        <span>Riwayat Kepengurusan</span>
                    </h2>

                    <ol className="relative border-l border-gray-200 ml-2 space-y-5">
                        {organizationHistory.map((org, idx) => (
                            <li
                                key={`${org.kabinet}-${org.jabatan}-${idx}`}
                                className="pl-5 relative"
                            >
                                <span
                                    aria-hidden="true"
                                    className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                        org.is_active ? "bg-emerald-500" : "bg-gray-300"
                                    }`}
                                />
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm font-bold text-gray-900">
                                        {org.jabatan ?? "Pengurus"}
                                    </p>
                                    {org.is_active && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                            Aktif
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    {[org.departemen, org.kabinet, org.year]
                                        .filter(Boolean)
                                        .join(" / ")}
                                </p>
                            </li>
                        ))}
                    </ol>
                </section>
            )}
        </aside>
    );
};

export default TalentSidebar;
