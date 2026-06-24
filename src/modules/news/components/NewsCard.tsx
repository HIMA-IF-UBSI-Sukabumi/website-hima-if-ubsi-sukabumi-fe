import Link from 'next/link'
import {FiClock, FiTag} from 'react-icons/fi'

type NewsCardProps = {
    title: string
    description: string
    image: string
    date: string
    category?: string
    href: string
    featured?: boolean
}

const NewsCard = ({
    title,
    description,
    image,
    date,
    category,
    href,
    featured = false,
}: NewsCardProps) => {
    if (featured) {
        return (
            <Link href={href} className="group block relative overflow-hidden rounded-3xl h-full min-h-[380px]">
                {/* Background image */}
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"/>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    {category && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-white px-2.5 py-1 rounded-full mb-3">
                            <FiTag className="w-2.5 h-2.5"/>
                            {category}
                        </span>
                    )}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight line-clamp-3 group-hover:text-tertiary transition duration-300">
                        {title}
                    </h2>
                    <div
                        className="mt-3 text-sm text-white/70 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{__html: description}}
                    />
                    <div className="flex items-center gap-2 mt-4 text-xs text-white/50">
                        <FiClock className="w-3.5 h-3.5"/>
                        <span>{date}</span>
                    </div>
                </div>

                {/* Read more pill */}
                <div className="absolute top-5 right-5">
                    <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full group-hover:bg-primary group-hover:border-primary transition duration-300">
                        Baca Selengkapnya →
                    </span>
                </div>
            </Link>
        )
    }

    return (
        <Link
            href={href}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
        >
            {/* Thumbnail */}
            <div className="relative overflow-hidden h-44">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"/>
                {category && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                        <FiTag className="w-2 h-2"/>
                        {category}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition duration-200">
                    {title}
                </h3>
                <div
                    className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{__html: description}}
                />
                <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400 pt-3 border-t border-gray-50">
                    <FiClock className="w-3 h-3"/>
                    <span>{date}</span>
                </div>
            </div>
        </Link>
    )
}

export default NewsCard
