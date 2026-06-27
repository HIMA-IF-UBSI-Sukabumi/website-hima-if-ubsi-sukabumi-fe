import Link from 'next/link'
import {FiClock} from 'react-icons/fi'

type NewsCardCompactProps = {
    title: string
    category?: string
    image: string
    date: string
    href: string
    index?: number
}

const NewsCardCompact = ({
    title,
    category,
    image,
    date,
    href,
    index,
}: NewsCardCompactProps) => {
    return (
        <Link
            href={href}
            className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-smoky transition-all duration-200 border border-transparent hover:border-gray-100"
        >
            {/* Ranking number */}
            {index !== undefined && (
                <span className="text-3xl font-black text-gray-400 items-center group-hover:text-primary/40 transition w-7 shrink-0 leading-none mt-1">
                    {String(index + 1).padStart(2, '0')}
                </span>
            )}

            {/* Thumbnail */}
            <div className="relative w-20 h-16 min-w-20 rounded-xl overflow-hidden shrink-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {category && (
                    <p className="text-[10px] font-extrabold tracking-widest text-primary uppercase mb-1">
                        {category}
                    </p>
                )}
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition duration-200">
                    {title}
                </h3>
                <div className="flex items-center gap-1 mt-1.5 text-gray-400 text-[10px]">
                    <FiClock className="w-3 h-3"/>
                    <span>{date}</span>
                </div>
            </div>
        </Link>
    )
}

export default NewsCardCompact
