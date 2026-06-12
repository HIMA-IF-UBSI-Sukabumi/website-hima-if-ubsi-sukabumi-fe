'use client'

import {useEffect, useState} from "react";
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";

export type CarouselItem = {
    title: string;
    description: string | null;
    image: string;
}

type CarouselProps = {
    items: CarouselItem[],
    autoSlide?: boolean;
    interval?: number;
}

const Carousel = ({items, autoSlide = true, interval = 7000}: CarouselProps) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!autoSlide) return;

        const slide = setInterval(() => {
            setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
        }, interval);

        return () => clearInterval(slide);
    }, [autoSlide, interval, items.length]);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full h-80 sm:h-100 md:h-112.5 lg:h-125 overflow-hidden rounded-2xl md:rounded-3xl">
            {items?.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                        index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                    <img
                        src={item.image}
                        className="w-full h-full object-cover"
                        alt={item.title}
                    />

                    <div className="absolute inset-0 bg-primary/70 md:bg-primary/60" />

                    <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-16 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-5 md:p-8 rounded-2xl w-[85%] sm:w-[80%] max-w-sm md:max-w-xl lg:max-w-2xl shadow-lg">
                        <span className="text-[10px] md:text-xs bg-primary font-black text-white px-2 py-1 md:px-3 md:py-1 rounded-full capitalize">
                          UPCOMING EVENT
                        </span>

                        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl mt-3 md:mt-4 font-archivo capitalize font-bold leading-tight">
                            {item.title}
                        </h2>

                        <p className="text-secondary text-xs sm:text-sm md:text-lg font-medium mt-2 md:mt-3 line-clamp-2 md:line-clamp-none">
                            {item.description}
                        </p>

                        <button className="mt-4 md:mt-6 px-4 md:px-5 py-2 text-xs sm:text-base bg-gray-200 font-bold rounded-full hover:bg-gray-300 transition">
                            Details
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="hidden md:block absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full z-50 transition shadow-sm"
            >
                <FiArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
                onClick={nextSlide}
                className="hidden md:block absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full z-50 transition shadow-sm"
            >
                <FiArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {items?.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer transition-colors ${
                            index === current ? "bg-white" : "bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Carousel;