import Link from "next/link";

const DepartmentLanding = () => {
    const departmentLists = [
        {
            name: 'Sinergi Publik',
            href: '/'
        },
        {
            name: 'Humanika',
            href: '/'
        },
        {
            name: 'Intelektual',
            href: '/'
        },
        {
            name: 'Smartlink',
            href: '/'
        }
    ]

    return (
        <section className={'w-full py-28'}>
            <div className={'max-w-7xl mx-auto px-6'}>
                <div className={'flex flex-col items-center justify-center'}>
                    <h1 className={'text-3xl uppercase text-secondary'}>Departmen</h1>

                    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'}>
                        {departmentLists.map((department, i) => (
                            <Link href={department.href} key={i}>
                                <div
                                    className={'border-t-3 border-t-secondary px-24 py-16 flex flex-col items-center justify-center bg-linear-to-b from-tertiary/50 to-white'}
                                >
                                    <h1 className={'text-4xl font-extrablack text-center uppercase text-primary'}>{department.name}</h1>
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