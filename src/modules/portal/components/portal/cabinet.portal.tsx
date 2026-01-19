const CabinetPortal = () => {
    return (
        <section
            className="flex flex-col items-center justify-center mx-auto max-w-7xl px-4 py-24 md:py-48 sm:px-6 lg:px-8"
        >
            <h1 className="text-5xl font-extrablack text-gray-900 sm:text-7xl mb-4">
                KABINET
            </h1>

            <div className="relative flex items-center justify-center z-20 pointer-events-none">
                <img
                    src="/assets/logo-anvadhistana.webp"
                    alt="Logo Kabinet Anvadhistana"
                    className="w-64 md:w-96 object-contain"
                />
            </div>

            <div className="-mt-14 sm:-mt-16 md:-mt-18 text-center z-30">
                <h1
                    className="text-black font-extrablack leading-tight text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                    style={{textShadow: '14px 7px 0px rgba(0,0,0,0.20)'}}
                >
                    ANVAYADHISTANA
                </h1>
            </div>
        </section>
    )
}

export default CabinetPortal;
