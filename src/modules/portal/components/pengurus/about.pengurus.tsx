type PageProps = {
    slug: string;
};

const AboutPengurus = ({slug}: PageProps) => {
    return (
        <section className="py-44 ">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-secondary">Tentang Pengurus {slug}</h2>
                </div>
            </div>
        </section>
    );
}

export default AboutPengurus;