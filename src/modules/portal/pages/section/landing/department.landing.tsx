'use client';

import { useRef } from "react";
import Link from "next/link";
import {DEPARTMENT_DATA} from "@/constants/department";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const DepartmentLanding = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".dept-title", {
            scrollTrigger: {
                trigger: ".dept-title",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        });

        gsap.from(".dept-card", {
            scrollTrigger: {
                trigger: ".dept-grid",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className={'w-full py-28'}>
            <div className={'max-w-7xl mx-auto px-6'}>
                <div className={'flex flex-col items-center justify-center'}>
                    <h1 className={'dept-title text-3xl uppercase text-secondary'}>Departmen</h1>

                    <div className={'dept-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'}>
                        {DEPARTMENT_DATA.map((department, i) => (
                            <Link href={'/department/' + department.slug} key={i} className="dept-card block">
                                <div
                                    className={'border-t-3 border-t-secondary px-24 py-16 flex flex-col items-center justify-center bg-linear-to-b from-tertiary/50 to-white h-full'}
                                >
                                    <h1 className={'text-4xl font-black text-center uppercase text-primary'}>{department.title}</h1>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DepartmentLanding;