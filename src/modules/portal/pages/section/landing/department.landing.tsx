import Link from "next/link";
import {DEPARTMENT_DATA} from "@/constants/department";

const DepartmentLanding = () => {
    return (
        <section className={'w-full py-28'}>
            <div className={'max-w-7xl mx-auto px-6'}>
                <div className={'flex flex-col items-center justify-center'}>
                    <h1 className={'text-3xl uppercase text-secondary'}>Departmen</h1>

                    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'}>
                        {DEPARTMENT_DATA.map((department, i) => (
                            <Link href={'/department/' + department.slug} key={i}>
                                <div
                                    className={'border-t-3 border-t-secondary px-24 py-16 flex flex-col items-center justify-center bg-linear-to-b from-tertiary/50 to-white'}
                                >
                                    <h1 className={'text-4xl font-black text-center uppercase text-primary'}>{department.title}</h1>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DepartmentLanding