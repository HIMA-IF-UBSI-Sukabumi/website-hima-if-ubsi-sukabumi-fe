const HeroPortal = () => {
    return (
        <section
            className="relative min-h-screen flex flex-col items-center justify-center bg-center bg-cover overflow-hidden"
            style={{backgroundImage: "url('/assets/hero-image-dummy.svg')"}}
        >
            <div className="absolute inset-0 bg-slate-800/60 z-10"/>

            <div
                className="relative z-20 mt-8 sm:mt-12 flex flex-row items-center justify-center gap-4 pointer-events-none">
                <img
                    src="/assets/logo-bsi.webp"
                    alt="Logo UBSI"
                    className="w-24 sm:w-32 lg:w-64 object-contain"
                />
                <img
                    src="/assets/logo-himaif.webp"
                    alt="Logo HIMA IF"
                    className="w-24 sm:w-32 lg:w-64 object-contain"
                />
            </div>

            <div className="relative z-20 text-center px-4 sm:px-6 md:px-8 lg:px-12">
                <h1
                    className="text-white font-extrablack leading-tight text-3xl sm:text-4xl md:text-6xl xl:text-7xl"
                    style={{textShadow: '14px 7px 0px rgba(0,0,0,0.20)'}}
                >
                    HIMPUNAN MAHASISWA <br/>
                    INFORMATIKA
                </h1>

                <p className="mt-4 text-white/90 font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl">
                    Universitas Bina Sarana Informatika <br/>
                    PSDKU Sukabumi
                </p>
            </div>
        </section>
    );
};

export default HeroPortal;
