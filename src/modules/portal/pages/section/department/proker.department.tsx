'use client';

import { useRef } from "react";
import CardProker from "@/modules/portal/components/CardProker";
import {DepartmentDataProps} from "@/constants/department";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
    data?: DepartmentDataProps;
};

const ProkerDepartment = ({data}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const proker = data?.programs || [];

    useGSAP(() => {
        if (!data) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (document.querySelector(".proker-title")) {
            tl.from(".proker-title", {
                opacity: 0,
                y: 30,
                duration: 0.8
            });
        }

        if (proker.length > 0 && document.querySelector(".proker-card-anim")) {
            tl.from(".proker-card-anim", {
                opacity: 0,
                y: 40,
                duration: 0.8,
                stagger: 0.15
            }, "-=0.5");
        }
    }, { scope: containerRef, dependencies: [data?.slug] });

    return (
        <section ref={containerRef} className="relative overflow-hidden flex flex-col items-center pb-20 px-4">
            <h2 className="proker-title text-3xl font-bold text-secondary mb-10 text-center">
                Program Kerja
            </h2>

            <div className="grid grid-cols-1 gap-6 w-full max-w-6xl place-items-center">
                {proker.map((item, i) => (
                    <div key={i} className="proker-card-anim w-full flex justify-center">
                        <CardProker
                            title={item.name}
                            description={item.description}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProkerDepartment;