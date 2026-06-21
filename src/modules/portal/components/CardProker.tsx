import React from "react";

type CardProkerProps = {
    title: string;
    description: string;
    className?: string;
};

const CardProker = ({title, description, className}: CardProkerProps) => {
    return (
        <div
            className={`relative w-full max-w-2xl p-8 md:p-10 rounded-3xl shadow-lg border border-gray-200 text-center ${className}`}
        >
            <div className="absolute inset-0 rounded-3xl bg-white/40 blur-2xl pointer-events-none"/>

            <div className="relative flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {title}
                </h2>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default CardProker;