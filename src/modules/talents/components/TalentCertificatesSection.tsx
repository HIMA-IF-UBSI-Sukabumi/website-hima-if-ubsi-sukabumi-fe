import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { TalentCertificateItem } from "@/modules/talents/services/api/talent.service";
import { FiArrowUpRight, FiCheckCircle, FiShield } from "react-icons/fi";

interface TalentCertificatesSectionProps {
    certificates: TalentCertificateItem[];
}

const TalentCertificatesSection = ({
    certificates,
}: TalentCertificatesSectionProps) => {
    if (certificates.length === 0) return null;

    return (
        <section id="sertifikat" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiShield className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span>Sertifikat Terverifikasi</span>
                </h2>
                <span className="text-xs font-medium text-gray-500">
                    {certificates.length} sertifikat
                </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 divide-y divide-gray-100">
                {certificates.map((cert) => (
                    <div
                        key={cert.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                        <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                <FiCheckCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span className="truncate font-mono">
                                    {cert.certificate_number}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">
                                {cert.event?.title ?? "Kegiatan HIMA-IF"}
                            </h3>
                            {cert.issued_at && (
                                <p className="text-xs text-gray-500">
                                    Diterbitkan {formatDate(cert.issued_at)}
                                </p>
                            )}
                        </div>

                        <Link
                            href={`/certificates/${cert.short_code}`}
                            className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition shrink-0 focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            <span>Verifikasi</span>
                            <FiArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TalentCertificatesSection;
