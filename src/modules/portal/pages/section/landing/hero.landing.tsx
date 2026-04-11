const HeroLanding = () => {
    return (
        <section
            className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
            style={{backgroundImage: "url('/assets/aurora.webp')"}}
        >
            <div
                className="relative z-20 mt-8 sm:mt-12 flex flex-row items-center justify-center gap-4 pointer-events-none">
                <img
                    src="/assets/logo-bsi.webp"
                    alt="Logo UBSI"
                    className="w-24 md:w-36 xl:w-41.25 object-contain"
                />
                <img
                    src="/assets/logo-himaif.webp"
                    alt="Logo HIMA IF"
                    className="w-24 md:w-36 xl:w-41.25 object-contain"
                />
            </div>

            <div className="relative z-20 text-center px-4 sm:px-6 md:px-8 lg:px-12">
                <h1
                    className="text-primary font-extrabold leading-tight text-[84px] uppercase"
                >
                    Himpunan Mahasiswa <br/>
                    Informatika
                </h1>

                <p className="mt-4 text-secondary font-extrabold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                    Universitas Bina Sarana Informatika <br/>
                    PSDKU Sukabumi
                </p>
            </div>
        </section>
    );
};

export default HeroLanding;
