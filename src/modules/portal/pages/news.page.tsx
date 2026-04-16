import CardNews from "@/modules/portal/components/CardNews";
import CardNewsCompact from "@/modules/portal/components/CardNewsCompact";

const ModulePortalNewsPage = () => {
    return (
        <section className={'overflow-hidden mt-38 pb-20 max-w-6xl mx-auto px-4'}>
            <h1 className={'text-2xl font-black'}>Berita & Artikel Terbaru</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4">
                <CardNews
                    title={'HIMA-IF Wins International'}
                    description={'lorem ipsum dolor sit amet'}
                    image={'/assets/news-image.png'}
                    date={'2027-08-19'}
                />

                <div className="flex flex-col gap-4 min-h-100 max-h-115 overflow-y-auto">
                    {[...Array(10)].map((_, i) => (
                        <CardNewsCompact
                            key={i}
                            title={'News Security Protocol'}
                            category={'Security Protocol'}
                            image={'/assets/news-compact-image.png'}
                            date={'2027-08-19'}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ModulePortalNewsPage;