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

const Carousel = ({items, autoSlide, interval}: CarouselProps) => {
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
        <div className="relative w-full h-105 overflow-hidden rounded-3xl">
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
                        className="absolute left-10 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-8 rounded-2xl max-w-3xl shadow-lg">
                        <span className="text-xs  bg-primary font-black text-white px-3 py-1 rounded-full capitalize">
                          Upcoming Event
                        </span>
                        <h2 className="text-3xl font-extrabold mt-4 text-black">
                            {item.title}
                        </h2>
                        <p className="text-gray-600 mt-3">{item.description}</p>
                        <button className="mt-6 px-5 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
                            Details
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-2 rounded-full"
            >
                <FiArrowLeft/>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-2 rounded-full"
            >
                <FiArrowRight/>
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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