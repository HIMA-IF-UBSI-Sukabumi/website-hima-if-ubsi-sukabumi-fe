import { FiClock } from "react-icons/fi";
import Link from "next/link";

type CardNewsProps = {
    title: string;
    description: string;
    image: string;
    date: string;
    href?: string;
    onClick?: () => void;
};

const CardNews = ({
    title,
    description,
    image,
    date,
    href,
    onClick,
}: CardNewsProps) => {
    const content = (
        <div className="group w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row">

            <div className="relative w-full md:w-1/3 h-56 md:h-auto overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </div>

            <div className="w-full md:w-2/3 p-5 md:p-7 flex flex-col justify-between">

                <p className="text-xs font-bold tracking-widest text-primary uppercase">
                    HIMA News
                </p>

                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mt-2 leading-snug line-clamp-2 group-hover:text-primary transition">
                    {title}
                </h2>

                <div
                    className="text-gray-500 mt-3 text-sm leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: description || "" }}
                />

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">

                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <FiClock className="w-4 h-4" />
                        <span>{date}</span>
                    </div>

                    <span className="text-sm font-semibold text-primary group-hover:underline">
                        Read More →
                    </span>

                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} className="block">{content}</Link>;
    }

    return <div onClick={onClick}>{content}</div>;
};

export default CardNews;