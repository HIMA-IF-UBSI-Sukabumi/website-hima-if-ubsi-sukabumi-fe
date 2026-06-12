import {FiCalendar} from "react-icons/fi";

type CardEventProps = {
    title: string;
    description?: string | null;
    image: string;
    date: string;
    tag: string;
}

const CardEvent = ({title, description, image, date, tag}: CardEventProps) => {
    return (
        <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-52 object-cover"
                />

                <div
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-primary text-xs font-semibold px-4 py-1 rounded-full shadow">
                    {tag}
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <FiCalendar/>
                    <span>{date}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-3">
                    {title}
                </h3>

                <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default CardEvent;