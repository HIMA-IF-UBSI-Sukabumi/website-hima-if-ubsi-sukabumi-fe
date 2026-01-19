const HeroPortal = () => {
    return (
        <section
            className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
            style={{backgroundImage: "url('/assets/bg-landing.webp')"}}
        >
            <div
                className="relative z-20 mt-8 sm:mt-12 flex flex-row items-center justify-center gap-4 pointer-events-none">
                <img
                    src="/assets/logo-bsi.webp"
                    alt="Logo UBSI"
                    className="w-38 md:w-48 lg:w-64 object-contain"
                />
                <img
                    src="/assets/logo-himaif.webp"
                    alt="Logo HIMA IF"
                    className="w-38 md:w-48 lg:w-64 object-contain"
                />
            </div>

            <div className="relative z-20 text-center px-4 sm:px-6 md:px-8 lg:px-12">
                <h1
                    className="text-primary font-extrablack leading-tight text-4xl sm:text-6xl md:text-7xl xl:text-8xl uppercase"
                >
                    Himpunan Mahasiswa <br/>
                    Informatika
                </h1>

                <p className="mt-4 text-secondary font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl">
                    Universitas Bina Sarana Informatika <br/>
                    PSDKU Sukabumi
                </p>
            </div>
        </section>
    );
};

export default HeroPortal;
