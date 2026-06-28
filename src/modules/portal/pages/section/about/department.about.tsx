'use client';

import { useRef } from "react";
import CardDepartment from "@/modules/portal/components/CardDepartment";
import {DEPARTMENT_DATA} from "@/constants/department";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const DepartmentAbout = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".dept-about-bubble", {
            scrollTrigger: {
                trigger: ".dept-about-bubble",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "back.out(1.5)"
        });

        gsap.from(".dept-about-card-anim", {
            scrollTrigger: {
                trigger: ".dept-about-grid",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative overflow-hidden flex flex-col items-center py-16">

            <div className="dept-about-bubble relative inline-block">

                <img
                    src="/assets/aurora-many-blobs.webp"
                    alt="bg"
                    className="block w-400px xl:w-500px max-w-full"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-[-2px] leading-[0.9] italic text-center">
                        Departmen
                    </h1>
                </div>

            </div>

            <div className="w-full max-w-6xl mx-auto px-4 mt-8">
                <div className="dept-about-grid grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-start">
                    {DEPARTMENT_DATA && DEPARTMENT_DATA.map((item, i) => (
                        <div key={i} className="dept-about-card-anim w-full">
                            <CardDepartment
                                id={i + 1}
                                title={item.title}
                                description={item.description}
                                logo={item.logo}
                                color={item.color}
                                href={'/department/' + item.slug}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default DepartmentAbout;