type PageProps = {
    slug: string;
};

const AboutPengurus = ({slug}: PageProps) => {
    const name = slug.replace(/-/g, " ");

    return (
        <section className={'relative overflow-hidden mt-14 md:mt-0'}>
            <div
                className="relative flex flex-col items-center justify-center mx-auto max-w-7xl px-4 py-24 md:py-48 sm:px-6 lg:px-8 gap-8 text-center"
            >
                <h3 className="text-3xl text-secondary font-thin">Struktur Kepengurusan</h3>
                <div className={'flex flex-col items-center'}>
                    <div className="">
                        <h1 className="relative text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-extrablack uppercase text-white tracking-wide leading-none">
                            {name}
                        </h1>

                        <img
                            src={'/assets/aurora-many-blobs.webp'}
                            className="absolute top-1/2  left-1/2 -translate-x-1/2 -translate-y-1/3 -z-10 pointer-events-none w-auto"
                            alt="background decoration"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
        ;
}

export default AboutPengurus;