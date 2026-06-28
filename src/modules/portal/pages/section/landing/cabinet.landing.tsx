'use client';

import { useRef } from "react";
import {usePathname} from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CabinetLanding = () => {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".cabinet-header",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        tl.from(".cabinet-title", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
          .from(".cabinet-name", { opacity: 0, y: 35, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from(".cabinet-logo", { opacity: 0, scale: 0.8, rotation: -5, duration: 1, ease: "back.out(1.5)" }, "-=0.5");

        if (document.querySelector(".cabinet-desc")) {
            tl.from(".cabinet-desc", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.6");
        }

        gsap.from(".cabinet-card", {
            scrollTrigger: {
                trigger: ".cabinet-cards-grid",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className={'relative overflow-hidden mt-14 md:mt-0'}>
            <img
                src={'/assets/aurora-blob.webp'}
                className={'absolute -left-120 top-0 -z-20 w-auto'}
                alt=""
            />

            <img
                src={'/assets/aurora-blob.webp'}
                className={'absolute -right-120 top-0 -z-20 w-auto'}
                alt=""
            />

            <div
                className="relative flex flex-col items-center justify-center mx-auto max-w-7xl px-4 py-24 md:py-48 sm:px-6 lg:px-8 gap-8 text-center"
            >
                <div className="cabinet-header flex flex-col items-center">
                    <h3 className="cabinet-title text-3xl text-secondary font-light">Periode Tahun 2026</h3>
                    <div className={'flex flex-col items-center'}>
                        <div>
                            <h1 className="cabinet-name font-archivo text-4xl sm:text-6xl md:text-7xl xl:text-8xl uppercase text-black tracking-wide leading-none">
                                Anvayadhistana
                            </h1>
                        </div>

                        <img
                            src={'/assets/logo-anvadhistana.webp'}
                            className={'cabinet-logo object-contain pointer-events-none'}
                            alt="Logo Kabinet Anvayadhistana"
                        />

                        {pathname === '/about' && (
                            <p className="cabinet-desc mt-4 mb-8 max-w-3xl text-lg md:text-2xl text-black text-center">
                                Kabinet <strong>ANVAYADHISTANA</strong> merupakan kepengurusan Himpunan Mahasiswa Informatika (HIMAIF) periode 2026/2027 yang berfokus pada penguatan sistem organisasi yang aktif, kolaboratif, dan relevan dengan kebutuhan mahasiswa Informatika melalui pengembangan program kerja, inovasi, dan penguatan sumber daya manusia.
                            </p>
                        )}

                        <div className={'cabinet-cards-grid max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 px-0 md:px-8 mt-12'}>
                            <div className={'cabinet-card border border-tertiary rounded-t-4xl px-16 w-full'}>
                                <div className={'flex flex-col items-center justify-center py-24 gap-4 h-full'}>
                                    <h1 className={'font-black text-5xl italic underline text-secondary'}>VISI</h1>
                                    <p>
                                        “Mewujudkan HIMAIF sebagai himpunan yang <strong>aktif, kolaboratif, dan relevan</strong> dengan kebutuhan mahasiswa Informatika.”
                                    </p>
                                </div>
                            </div>
                            <div className={'cabinet-card border border-tertiary rounded-t-4xl px-16 w-full'}>
                                <div className={'flex flex-col items-center justify-center py-24 gap-4 h-full'}>
                                    <h1 className={'font-black text-5xl italic underline text-secondary'}>MISI</h1>
                                    <ul>
                                        <li><span className={'font-bold'}>Quality Boost:</span> Meningkatkan kualitas
                                            program kerja yang bermanfaat secara akademik (Hard Skill) dan non-akademik
                                            (Soft Skill).
                                        </li>
                                        <li>
                                            <span className={'font-bold'}>Open Connect:</span> Membangun komunikasi yang
                                            terbuka dan transparan antara pengurus, anggota, dan birokrasi kampus.
                                        </li>
                                        <li><span className={'font-bold'}>Talent Hub:</span> Menjadi inkubator pengembangan
                                            minat, bakat, and skill teknis mahasiswa Informatika.
                                        </li>
                                        <li><span className={'font-bold'}>Solid Base:</span> Menguatkan rasa kebersamaan
                                            (keluarga) dan tanggung
                                            jawab profesional dalam organisasi
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CabinetLanding;
