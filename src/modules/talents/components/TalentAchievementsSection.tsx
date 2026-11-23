import { formatDate, resolveImageUrl } from "@/lib/utils";
import type { TalentAchievementItem } from "@/modules/talents/services/api/talent.service";
import { FiAward, FiCalendar } from "react-icons/fi";

interface TalentAchievementsSectionProps {
    achievements: TalentAchievementItem[];
}

const TalentAchievementsSection = ({
    achievements,
}: TalentAchievementsSectionProps) => {
    if (achievements.length === 0) return null;

    return (
        <section id="prestasi" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiAward className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span>Prestasi</span>
                </h2>
                <span className="text-xs font-medium text-gray-500">
                    {achievements.length} pencapaian
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((item) => {
                    const coverUrl = resolveImageUrl(item.cover_image);

                    return (
                        <article
                            key={item.id}
                            className="bg-white rounded-2xl border border-gray-200/80 p-5 flex gap-4 items-start"
                        >
                            {coverUrl ? (
                                <img
                                    src={coverUrl}
                                    alt={`Dokumentasi ${item.title}`}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                                    loading="lazy"
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/70"
                                >
                                    <FiAward className="w-5 h-5" />
                                </div>
                            )}

                            <div className="min-w-0 flex-1 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    {item.level && (
                                        <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                            {item.level}
                                        </span>
                                    )}
                                    {item.date_achieved && (
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                            <FiCalendar className="w-3 h-3" aria-hidden="true" />
                                            {formatDate(item.date_achieved)}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <div
                                        className="prose prose-xs sm:prose-sm max-w-none text-gray-600 leading-relaxed prose-p:my-1 prose-ul:my-1 prose-ol:my-1"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default TalentAchievementsSection;
