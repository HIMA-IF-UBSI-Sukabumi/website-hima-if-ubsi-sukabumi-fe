import CardDepartment from "@/modules/portal/components/CardDepartment";
import {DEPARTMENT_DATA} from "@/constants/department";

const DepartmentAbout = () => {
    return (
        <section className="relative overflow-hidden flex flex-col items-center py-16">

            <div className="relative inline-block">

                <img
                    src="/assets/aurora-many-blobs.webp"
                    alt="bg"
                    className="block w-400px xl:w-500px max-w-full"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-[-2px] leading-[0.9] italic text-center">
                        Departmen
                    </h1>
                </div>

            </div>

            <div className="w-full max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-start">
                    {DEPARTMENT_DATA && DEPARTMENT_DATA.map((item, i) => (
                        <CardDepartment
                            key={i}
                            id={i + 1}
                            title={item.title}
                            description={item.description}
                            logo={item.logo}
                            color={item.color}
                            href={'/department/' + item.slug}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default DepartmentAbout