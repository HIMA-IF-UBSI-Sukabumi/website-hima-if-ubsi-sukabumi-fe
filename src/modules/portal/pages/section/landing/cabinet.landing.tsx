'use client';

import {usePathname} from "next/navigation";

const CabinetLanding = () => {
    const pathname = usePathname();

    return (
        <section className={'relative overflow-hidden mt-14 md:mt-0'}>
            <img
                src={'/assets/aurora-blob.webp'}
                className={'absolute -left-120 top-0 -z-20 w-auto'}
            />

            <img
                src={'/assets/aurora-blob.webp'}
                className={'absolute -right-120 top-0 -z-20 w-auto'}
            />

            <div
                className="relative flex flex-col items-center justify-center mx-auto max-w-7xl px-4 py-24 md:py-48 sm:px-6 lg:px-8 gap-8 text-center"
            >
                <h3 className="text-3xl text-secondary font-light">Periode Tahun 2026</h3>
                <div className={'flex flex-col items-center'}>
                    <div>
                        <h1 className="font-archivo text-4xl sm:text-6xl md:text-7xl xl:text-8xl uppercase text-black tracking-wide leading-none">
                            Anvayadhistana
                        </h1>
                    </div>

                    <img
                        src={'/assets/logo-anvadhistana.webp'}
                        className={'object-contain pointer-events-none'}
                        alt="Logo Kabinet Anvayadhistana"
                    />

                    {pathname === '/about' && (
                        <p className="mt-4 mb-8 max-w-3xl text-lg md:text-2xl text-black text-center">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod mauris et nunc semper
                            sollicitudin. Fusce auctor, leo ac vulputate semper.
                        </p>
                    )}

                    <div className={'max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 px-0 md:px-8'}>
                        <div className={'border border-tertiary rounded-t-4xl px-16 w-full'}>
                            <div className={'flex flex-col items-center justify-center py-24 gap-4 h-full'}>
                                <h1 className={'font-black text-5xl italic underline text-secondary'}>VISI</h1>
                                <p>
                                    Mewujudkan HIMA-IF sebagai himpunan yang aktif, kolaboratif, dan relevan dengan
                                    kebutuhan mahasiswa Informatika
                                </p>
                            </div>
                        </div>
                        <div className={'border border-tertiary rounded-t-4xl px-16 w-full'}>
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
                                        minat, bakat, dan skill teknis mahasiswa Informatika.
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
        </section>
    )
}

export default CabinetLanding;
