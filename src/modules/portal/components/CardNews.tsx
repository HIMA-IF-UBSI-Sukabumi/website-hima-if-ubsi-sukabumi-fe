import {FiClock} from "react-icons/fi";

type CardNewsProps = {
    title: string;
    description: string;
    image: string;
    date: string;
    onClick?: () => void;
}

const CardNews = ({title, description, image, date, onClick}: CardNewsProps) => {
    return (
        <div
            onClick={onClick}
            className="w-full bg-white rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-md hover:shadow-lg transition cursor-pointer border border-secondary"
        >
            <div className="w-full md:w-1/3">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-56 object-cover rounded-2xl"
                />
            </div>

            <div className="w-full md:w-2/3">
                <p className="text-sm font-semibold text-primary tracking-wide">
                    HIMA NEWS
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-2 leading-snug">
                    {title}
                </h2>

                <p className="text-gray-500 mt-3 line-clamp-3">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FiClock/>
                        <span>{date}</span>
                    </div>

                    <span className="text-black font-semibold hover:underline">
                        Read More
                    </span>
                </div>
            </div>
        </div>

    )
}

export default CardNews;