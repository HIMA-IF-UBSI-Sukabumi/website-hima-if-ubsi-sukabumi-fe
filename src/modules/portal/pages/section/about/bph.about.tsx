'use client';

import { useRef } from "react";
import CardBph from "@/modules/portal/components/CardBph";
import {BPH_DATA} from "@/constants/bph";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const BphAbout = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".bph-header", {
            scrollTrigger: {
                trigger: ".bph-header",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        });

        gsap.from(".bph-bubble", {
            scrollTrigger: {
                trigger: ".bph-bubble",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "back.out(1.5)"
        });

        gsap.from(".bph-card-anim", {
            scrollTrigger: {
                trigger: ".bph-cards-container",
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
        <section ref={containerRef} className="relative overflow-hidden flex flex-col items-center pb-20">
            <h3 className="bph-header text-3xl text-secondary font-thin mb-10">
                Struktur Kepengurusan
            </h3>

            <div className="bph-bubble relative inline-block mb-16">
                <img
                    src="/assets/aurora-many-blobs.webp"
                    alt="bg"
                    className="block w-100 xl:w-125 max-w-full"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-[-2px] leading-[0.9] italic text-center">
                        Badan <br/> Pengurus Harian
                    </h1>
                </div>
            </div>

            <div className="bph-cards-container flex flex-col items-center gap-6 md:gap-8 w-full max-w-5xl px-4 mt-8">
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full">
                    {BPH_DATA.slice(0, 2).map((item) => (
                        <div key={item.id} className="bph-card-anim flex justify-center w-full md:w-auto">
                            <CardBph
                                title={item.title}
                                name={item.name}
                                imageUrl={item.image}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center w-full z-10">
                    {BPH_DATA.slice(2, 3).map((item) => (
                        <div key={item.id} className="bph-card-anim flex justify-center w-full">
                            <CardBph
                                title={item.title}
                                name={item.name}
                                imageUrl={item.image}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full">
                    {BPH_DATA.slice(3, 5).map((item) => (
                        <div key={item.id} className="bph-card-anim flex justify-center w-full md:w-auto">
                            <CardBph
                                title={item.title}
                                name={item.name}
                                imageUrl={item.image}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BphAbout;