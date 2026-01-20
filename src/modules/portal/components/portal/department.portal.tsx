const DepartmentPortal = () => {
    const departmentLists = [
        'Sinergi Publik',
        'Humanika',
        'Intelektual',
        'Smartlink'
    ]

    return (
        <section className={'w-full py-28'}>
            <div className={'max-w-7xl mx-auto px-6'}>
                <div className={'flex flex-col items-center justify-center'}>
                    <h1 className={'text-3xl uppercase text-secondary'}>Departmen</h1>

                    <div className={'grid grid-cols-4 gap-4 mt-4'}>
                        {departmentLists.map((department, i) => (
                            <div
                                key={i}
                                className={'border-t-3 border-t-secondary px-24 py-16 flex flex-col items-center justify-center bg-linear-to-b from-tertiary/50 to-white'}
                            >
                                <h1 className={'text-4xl font-extrablack text-center uppercase text-primary'}>{department}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DepartmentPortal