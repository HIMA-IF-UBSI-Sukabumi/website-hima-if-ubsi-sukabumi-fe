import React from 'react';

type CardBphProps = {
    imageUrl: string;
    title: string;
    name: string;
}

const CardBph = ({imageUrl, title, name}: CardBphProps) => {
    return (
        <div className="relative w-85 h-100 rounded-3xl overflow-hidden shadow-md group border border-primary">
            <img
                src={imageUrl}
                alt={`Foto ${name}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div
                className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#0F172A]/90 via-[#0F172A]/50 to-transparent pointer-events-none"></div>

            <div className="absolute bottom-0 w-full p-5 flex flex-col items-center justify-end z-10">
                <h3
                    className="text-white font-extrabold text-2xl tracking-wide uppercase text-center mb-1"
                    style={{
                        textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                    }}
                >
                    {title}
                </h3>
                <p
                    className="text-gray-200 font-light text-md md:text-lg text-center drop-shadow-sm"
                    style={{
                        textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                    }}
                >
                    {name}
                </p>
            </div>
        </div>
    );
}

export default CardBph;