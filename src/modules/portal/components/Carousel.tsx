'use client'

import {useEffect, useState} from "react";
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";

export type CarouselItem = {
    title: string;
    description: string;
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
        <div className="relative w-full h-125 overflow-hidden rounded-3xl">
            {items?.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                    <img
                        src={item.image}
                        className="w-full h-full object-cover"
                        alt={item.title}
                    />

                    <div className="absolute inset-0 bg-primary/70"/>

                    <div
                        className="absolute left-16 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md p-8 rounded-2xl min-w-2xl max-w-3xl shadow-lg">
                        <span className="text-xs  bg-primary font-black text-white px-3 py-1 rounded-full capitalize">
                          UPCOMING EVENT
                        </span>
                        <h2 className="text-4xl mt-4 font-archivo capitalize">
                            {item.title}
                        </h2>
                        <p className="text-gray-600 text-xl font-medium mt-3">{item.description}</p>
                        <button
                            className="mt-6 px-5 py-2 bg-gray-200 font-bold rounded-full hover:bg-gray-300 transition">
                            Details
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-2 rounded-full z-50 cursor-pointer"
            >
                <FiArrowLeft/>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-2 rounded-full z-50 cursor-pointer"
            >
                <FiArrowRight/>
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50 cursor-pointer">
                {items?.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer ${
                            index === current ? "bg-white" : "bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Carousel;