import Link from "next/link";
import { FiCalendar, FiExternalLink, FiUser, FiArrowUpRight } from "react-icons/fi";
import { formatTimestamp, resolveImageUrl } from "@/lib/utils";
import { ProjectItem } from "@/modules/portal/services/api/project.service";

type CardProjectProps = {
    project: ProjectItem;
};

const CardProject = ({ project }: CardProjectProps) => {
    const coverUrl = resolveImageUrl(project.cover_image);

    // Clean description from HTML tags if any
    const cleanDesc = project.description
        ? project.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
        : null;

    // Get initials for avatar fallback
    const authorInitials = project.author?.name
        ? project.author.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()
        : "IF";

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
            {/* Card Image Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <span className="text-4xl mb-1">💻</span>
                        <span className="text-xs font-medium">Proyek Informatika</span>
                    </div>
                )}

                {/* Gradient subtle shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges on top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-primary shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Karya Mahasiswa
                    </span>

                    {project.project_url && (
                        <span
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white shadow-sm"
                            title="Tersedia tautan proyek"
                        >
                            <FiExternalLink className="w-3.5 h-3.5" />
                        </span>
                    )}
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 p-5 sm:p-6">
                {/* Date & Author */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5 text-secondary" />
                        <span>{project.published_at ? formatTimestamp(project.published_at) : "Baru saja"}</span>
                    </div>
                    {project.author && (
                        <div className="flex items-center gap-1 text-gray-500 font-medium truncate max-w-[140px]">
                            <FiUser className="w-3 h-3 text-secondary shrink-0" />
                            <span className="truncate">{project.author.name}</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold font-archivo text-black leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                    {project.title}
                </h3>

                {/* Description */}
                {cleanDesc && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4 flex-1">
                        {cleanDesc}
                    </p>
                )}

                {/* Card Footer */}
                <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {authorInitials}
                        </div>
                        <span className="text-xs font-semibold text-gray-700 truncate max-w-[130px]">
                            {project.author?.name ?? "Mahasiswa IF"}
                        </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-primary transition-colors">
                        Lihat Proyek
                        <FiArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                </div>
            </div>

            {/* Entire Card Click Target */}
            <Link
                href={`/project/${project.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`Lihat detail ${project.title}`}
            >
                <span className="sr-only">Lihat detail {project.title}</span>
            </Link>
        </div>
    );
};

export default CardProject;
