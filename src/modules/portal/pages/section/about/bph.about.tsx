import CardBph from "@/modules/portal/components/CardBph";
import {BPH_DATA} from "@/constants/bph";

const BphAbout = () => {
    return (
        <section className="relative overflow-hidden flex flex-col items-center pb-20">
            <h3 className="text-3xl text-secondary font-thin mb-10">
                Struktur Kepengurusan
            </h3>

            <div className="relative inline-block mb-16">
                <img
                    src="/assets/aurora-many-blobs.webp"
                    alt="bg"
                    className="block w-100 xl:w-125 max-w-full"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-[-2px] leading-[0.9] italic text-center">
                        Badan <br/> Pengurus Harian
                    </h1>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-5xl px-4 mt-8">
                <div className="flex flex-col md:flex-row justify-center gap-6 w-full">
                    {BPH_DATA.slice(0, 2).map((item) => (
                        <CardBph
                            key={item.id} 
                            title={item.title} 
                            name={item.name} 
                            imageUrl={item.image}
                        />
                    ))}
                </div>

                <div className="flex justify-center w-full z-10">
                    {BPH_DATA.slice(2, 3).map((item) => (
                        <CardBph
                            key={item.id} 
                            title={item.title} 
                            name={item.name} 
                            imageUrl={item.image}
                        />
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-6 w-full">
                    {BPH_DATA.slice(3, 5).map((item) => (
                        <CardBph
                            key={item.id} 
                            title={item.title} 
                            name={item.name} 
                            imageUrl={item.image}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BphAbout;