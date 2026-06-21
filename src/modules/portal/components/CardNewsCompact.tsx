import {FiClock} from "react-icons/fi";
import Link from "next/link";

type CardNewsCompactProps = {
    title: string;
    category: string;
    image: string;
    date: string;
    href?: string;
    onClick?: () => void;
};

const CardNewsCompact = ({
                             title,
                             category,
                             image,
                             date,
                             href,
                             onClick,
                         }: CardNewsCompactProps) => {
    const content = (
        <div
            className="group w-full flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 transition cursor-pointer border border-transparent hover:border-gray-100">

            <div className="relative w-16 h-16 min-w-16 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"/>
            </div>

            <div className="flex-1 min-w-0">

                <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
                    {category}
                </p>

                <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition">
                    {title}
                </h3>

                <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                    <FiClock className="w-3.5 h-3.5"/>
                    <span>{date}</span>
                </div>

            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        );
    }

    return <div onClick={onClick}>{content}</div>;
};

export default CardNewsCompact;