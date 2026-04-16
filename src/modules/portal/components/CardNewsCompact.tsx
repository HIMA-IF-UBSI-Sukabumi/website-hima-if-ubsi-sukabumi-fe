import {FiClock} from "react-icons/fi";

type CardNewsCompactProps = {
    title: string;
    category: string;
    image: string;
    date: string;
    onClick?: () => void;
}

const CardNewsCompact = ({title, category, image, date, onClick}: CardNewsCompactProps) => {
    return (
        <div
            onClick={onClick}
            className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition cursor-pointer"
        >
            <div className="w-16 h-16 min-w-16 rounded-2xl overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
                    {category}
                </p>

                <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                    {title}
                </h3>

                <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                    <FiClock size={12}/>
                    <span>{date}</span>
                </div>
            </div>
        </div>
    )
}

export default CardNewsCompact;