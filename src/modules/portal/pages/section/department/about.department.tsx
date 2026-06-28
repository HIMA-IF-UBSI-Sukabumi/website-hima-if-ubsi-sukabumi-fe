'use client';

import { useRef } from "react";
import {DepartmentDataProps} from "@/constants/department";
import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
    data?: DepartmentDataProps;
    activeTab?: string;
    setActiveTab?: React.Dispatch<React.SetStateAction<"team" | "program">>;
}

const AboutDepartment = ({data, activeTab, setActiveTab}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!data) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".dept-logo-wrapper", {
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            ease: "back.out(1.7)"
        });

        tl.from(".dept-title", {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, "-=0.4");

        tl.from(".dept-desc", {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, "-=0.4");

        tl.from(".dept-tabs", {
            opacity: 0,
            y: 15,
            duration: 0.6
        }, "-=0.4");
    }, { scope: containerRef, dependencies: [data?.slug] });

    return (
        <section ref={containerRef} className={'relative overflow-hidden mt-14 md:mt-0'}>
            <div className="relative flex flex-col items-center justify-center mx-auto max-w-xl px-4 pt-24 md:pt-48 pb-16 sm:px-6 lg:px-8 text-center">
                <div
                    className="dept-logo-wrapper w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow"
                    style={{
                        backgroundColor: data?.color
                    }}
                >
                    <img src={data?.logo} className="w-10" alt=""/>
                </div>

                <h1 className="dept-title text-3xl font-extrabold">{data?.title}</h1>

                <p className="dept-desc text-gray-500 mt-3 text-sm leading-relaxed">
                    {data?.description}
                </p>

                <div className="dept-tabs mt-6 bg-gray-100 rounded-xl p-2 flex">
                    <button
                        onClick={() => setActiveTab ? setActiveTab("team") : undefined}
                        className={`px-6 py-2 rounded-lg text-sm transition ${
                            activeTab === "team"
                                ? `text-white shadow`
                                : "text-gray-500"
                        }`}
                        style={{
                            backgroundColor: activeTab === "team" ? data?.color : undefined
                        }}
                    >
                        Tim
                    </button>

                    <button
                        onClick={() => setActiveTab ? setActiveTab("program") : undefined}
                        className={`px-6 py-2 rounded-lg text-sm transition ${
                            activeTab === "program"
                                ? "text-white shadow"
                                : "text-gray-500"
                        }`}
                        style={{
                            backgroundColor: activeTab === "program" ? data?.color : undefined
                        }}
                    >
                        Program Kerja
                    </button>
                </div>
            </div>
        </section>
    )
}

export default AboutDepartment;