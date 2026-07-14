import React from "react";
import Link from "next/link";

type CardAboutProps = {
  id: number;
  title: string;
  description: string;
  logo: string;
  color: string;
  href?: string;
};

const CardDepartment = ({
  id,
  title,
  description,
  logo,
  color,
  href,
}: CardAboutProps) => {
  return (
    <Link href={href || "#"} className="block h-full">
      <div className="relative w-full max-w-2xl h-full min-h-85 p-8 border border-secondary rounded-4xl overflow-hidden font-sans flex flex-col bg-white hover:shadow-lg transition">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/70 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />

        <div className="relative flex justify-between items-start">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: color }}
          >
            <img
              src={logo || "https://placehold.co/1080x1080.png"}
              alt={`${title} icon`}
              className="w-10 h-10 object-contain"
            />
          </div>

          <span
            className="font-bold text-sm tracking-widest pt-2"
            style={{ color }}
          >
            DEPT 0{id}
          </span>
        </div>

        <div className="relative mt-8 flex flex-col flex-1">
          <h2 className="text-[28px] md:text-4xl font-extrabold tracking-tight text-[#111827] mb-4">
            {title}
          </h2>

          <p className="text-[#475569] text-base md:text-lg leading-relaxed text-justify line-clamp-6">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CardDepartment;
