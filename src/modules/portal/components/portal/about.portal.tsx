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
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-gray-700">Tentang</h3>
                    <h1 className="text-5xl font-extrablack text-black sm:text-7xl">
                        HIMA-IF
                    </h1>
                    <p className="mt-4 text-lg text-black">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod mauris et nunc semper
                        sollicitudin. Fusce auctor, leo ac vulputate semper.
                    </p>

                    <Link
                        href={'/about'}
                        className="group flex items-center justify-between bg-gray-300 pl-6 rounded-full w-40 h-11.25 transition-all hover:bg-gray-400">
                        <span className="text-black font-medium">Telusuri!</span>

                        <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
                            <HiArrowUpRight className={'text-white'}/>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default AboutPortal;
