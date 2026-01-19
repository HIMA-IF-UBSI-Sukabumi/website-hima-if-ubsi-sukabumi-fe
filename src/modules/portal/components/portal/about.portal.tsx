import Link from "next/link";

const AboutPortal = () => {
    return (
        <section
            className="flex flex-col-reverse md:flex-row items-center justify-between mx-auto max-w-7xl px-4 py-24 md:py-48 sm:px-6 lg:px-8 gap-8 md:gap-16">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-700">Tentang</h3>
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    HIMA IF UBSI PSDKU Sukabumi
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod mauris et nunc semper
                    sollicitudin. Fusce auctor, leo ac vulputate semper.
                </p>

                <Link href="/" className="underline italic font-bold text-xl mt-4">
                    Telusuri
                </Link>
            </div>

            <div className="w-full md:w-1/2 flex flex-row items-center justify-center gap-4">
                <div className="flex-1 max-w-50 md:max-w-[256px] lg:max-w-75">
                    <img
                        src="/assets/logo.webp"
                        alt="Logo HIMA IF"
                        className="w-full h-auto object-contain"
                    />
                </div>

                <div className="flex-1 max-w-50 md:max-w-[256px] lg:max-w-75">
                    <img
                        src="/assets/bsi.webp"
                        alt="Logo UBSI"
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>

        </section>
    )
}

export default AboutPortal;
