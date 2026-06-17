import React from 'react';
import Link from "next/link";

type CardAboutProps = {
    id: number;
    title: string;
    description: string;
    logo: string;
    color: string;
    href?: string;
}

const CardDepartment = ({id, title, description, logo, color, href}: CardAboutProps) => {
    return (
        <Link href={href || '#'}>
            <div
                className="relative w-full max-w-2xl p-8  border border-secondary rounded-4xl overflow-hidden font-sans"
            >
                <div
                    className="absolute top-0 right-0 w-64 h-64 bg-white/70 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>

                <div className="relative flex justify-between items-start">
                    <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-[#1A237E]/20`}
                        style={{backgroundColor: color}}
                    >
                        <img
                            src={logo}
                            alt={`${title} icon`}
                            className="w-10 h-10 object-contain"
                        />
                    </div>

                    <span
                        className={`font-bold text-sm tracking-widest pt-2`}
                        style={{color: color}}
                    >
                    DEPT 0{id}
                </span>
                </div>

                <div className="relative mt-8">
                    <h2 className="text-[32px] md:text-4xl font-extrabold tracking-tight text-[#111827] mb-4">
                        {title}
                    </h2>

                    <p className="text-[#475569] text-base md:text-lg leading-relaxed text-justify">
                        {description.slice(0, 250) + ' ...'}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default CardDepartment;