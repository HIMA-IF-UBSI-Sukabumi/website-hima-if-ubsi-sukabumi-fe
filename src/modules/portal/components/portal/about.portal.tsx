import Link from "next/link";
import {HiArrowUpRight} from "react-icons/hi2";

const AboutPortal = () => {
    return (
        <section className={'relative overflow-hidden'}>
            <img
                src={'/assets/dust.webp'}
                className={'absolute right-0 top-0 -z-20 w-auto'}
            />

            <div
                className="relative flex flex-col-reverse md:flex-row items-center justify-between mx-auto max-w-7xl px-4 py-24 md:py-48 sm:px-6 lg:px-8 gap-8 md:gap-16"
            >
                <div
                    className="w-full md:w-1/2 flex flex-col gap-4 order-2 md:order-1 items-center text-center md:items-start md:text-left"
                >
                    <h3 className="text-lg font-medium text-secondary mb-8">
                        Tentang
                    </h3>

                    <h1 className="text-5xl font-extrablack text-black sm:text-7xl">
                        HIMA-IF
                    </h1>

                    <p className="mt-4 text-lg text-black">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod mauris et nunc semper
                        sollicitudin. Fusce auctor, leo ac vulputate semper.
                    </p>

                    <Link
                        href="/about"
                        className="group flex items-center justify-between bg-gray-300 pl-6 rounded-full w-40 h-11.25 transition-all hover:bg-gray-400"
                    >
                        <span className="text-black font-medium">Telusuri!</span>

                        <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
                            <HiArrowUpRight className="text-white"/>
                        </div>
                    </Link>
                </div>


                <div className="max-w-6xl mx-auto px-6 relative order-1 md:order-2">
                    <div className="relative max-w-xl border border-tertiary rounded-b-4xl px-12 py-14 bg-transparent">
                        <p className="text-black leading-relaxed text-center">
                            Bergerak Bersama mahasiswa Informatika demi mewujudkan Himpunan
                            Mahasiswa Informatika Kampus Sukabumi Sebagai Organisasi yang lebih
                            maju dalam bidang teknologi dan informatika.
                        </p>

                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-20">
                            <div className="relative w-28 h-28 rounded-full">
                                <div className="absolute inset-0 rounded-full bg-primary blur-sm"></div>
                                <div
                                    className="relative w-full h-full rounded-full bg-primary flex items-center justify-center shadow-lg"
                                >
                                      <span className="text-secondary font-black italic underline text-3xl uppercase">
                                            Visi
                                      </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="relative max-w-xl ml-auto mt-40 border border-tertiary rounded-t-4xl px-12 py-14 bg-transparent"
                    >
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20">
                            <div className="relative w-28 h-28 rounded-full">
                                <div className="absolute inset-0 rounded-full bg-primary blur-sm"></div>
                                <div
                                    className="relative w-full h-full rounded-full bg-primary flex items-center justify-center shadow-lg"
                                >
                                      <span className="text-secondary font-black italic underline text-3xl uppercase">
                                            Misi
                                      </span>
                                </div>
                            </div>
                        </div>


                        <div className={'text-center'}>
                            <p className="text-black font-semibold mb-2">
                                Membangun Keharmonisan dan Kerjasama
                            </p>
                            <p className="text-black mb-4">
                                antar seluruh Mahasiswa Himpunan Mahasiswa Informatika.
                            </p>

                            <p className="text-black font-semibold mb-2">
                                Menjadi
                            </p>
                            <p className="text-black mb-4">
                                wadah aspirasi bagi seluruh mahasiswa Himpunan Mahasiswa Informatika.
                            </p>

                            <p className="text-black font-semibold mb-2">
                                Meningkatkan
                            </p>
                            <p className="text-black">
                                kemampuan dan pengetahuan mahasiswa jurusan Informatika.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutPortal;
