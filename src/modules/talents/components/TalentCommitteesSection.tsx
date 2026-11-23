import type { TalentCommitteeItem } from "@/modules/talents/services/api/talent.service";
import { FiBriefcase } from "react-icons/fi";

interface TalentCommitteesSectionProps {
    committees: TalentCommitteeItem[];
}

const TalentCommitteesSection = ({
    committees,
}: TalentCommitteesSectionProps) => {
    if (committees.length === 0) return null;

    return (
        <section id="kepanitiaan" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiBriefcase className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span>Kepanitiaan Kegiatan</span>
                </h2>
                <span className="text-xs font-medium text-gray-500">
                    {committees.length} kegiatan
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {committees.map((committee) => (
                    <div
                        key={committee.id}
                        className="bg-white rounded-xl border border-gray-200/80 p-4 space-y-1"
                    >
                        <p className="text-sm font-bold text-gray-900">
                            {committee.event?.title ?? "Kegiatan HIMA-IF"}
                        </p>
                        {committee.role && (
                            <p className="text-xs font-semibold text-primary">
                                {committee.role}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TalentCommitteesSection;
