import Link from "next/link";
import { formatTimestamp, resolveImageUrl } from "@/lib/utils";
import type { TalentProjectItem } from "@/modules/talents/services/api/talent.service";
import { FiArrowUpRight, FiExternalLink, FiFolder } from "react-icons/fi";

interface TalentProjectsSectionProps {
    projects: TalentProjectItem[];
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const TalentProjectsSection = ({ projects }: TalentProjectsSectionProps) => {
    if (projects.length === 0) return null;

    return (
        <section id="proyek" className="scroll-mt-28 space-y-4">
            <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiFolder className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span>Proyek</span>
                </h2>
                <span className="text-xs font-medium text-gray-500">
                    {projects.length} karya
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projects.map((project) => {
                    const coverUrl = resolveImageUrl(project.cover_image);
                    const cleanDesc = project.description
                        ? stripHtml(project.description)
                        : null;

                    return (
                        <article
                            key={project.id}
                            className="group bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden flex flex-col"
                        >
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 shrink-0">
                                {coverUrl ? (
                                    <img
                                        src={coverUrl}
                                        alt={`Cover proyek ${project.title}`}
                                        width={640}
                                        height={400}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                        <span className="text-3xl mb-1">💻</span>
                                        <span className="text-xs font-medium">Proyek Informatika</span>
                                    </div>
                                )}

                                <div className="absolute top-3 left-3">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-primary shadow-xs">
                                        {project.role}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1 space-y-2.5 min-w-0">
                                {project.published_at && (
                                    <span className="text-xs text-gray-400">
                                        {formatTimestamp(project.published_at)}
                                    </span>
                                )}

                                <h3 className="text-base sm:text-lg font-bold font-archivo text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                    {project.title}
                                </h3>

                                {cleanDesc && (
                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 flex-1 leading-relaxed">
                                        {cleanDesc}
                                    </p>
                                )}

                                {(project.slug || project.project_url) && (
                                    <div className="pt-3 mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
                                        {project.slug ? (
                                            <Link
                                                href={`/project/${project.slug}`}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary rounded"
                                            >
                                                <span>Lihat Proyek</span>
                                                <FiArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                                            </Link>
                                        ) : (
                                            <span />
                                        )}
                                        {project.project_url && (
                                            <a
                                                href={project.project_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded"
                                            >
                                                <span>Demo / Repo</span>
                                                <FiExternalLink className="w-3 h-3" aria-hidden="true" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default TalentProjectsSection;
