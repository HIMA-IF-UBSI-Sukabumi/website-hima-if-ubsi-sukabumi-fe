import CardProker from "@/modules/portal/components/CardProker";
import {DepartmentDataProps} from "@/constants/department";

type Props = {
    data?: DepartmentDataProps;
};

const ProkerDepartment = ({data}: Props) => {
    const proker = data?.programs || [];

    return (
        <section className="relative overflow-hidden flex flex-col items-center pb-20 px-4">
            <h2 className="text-3xl font-bold text-secondary mb-10 text-center">
                Program Kerja
            </h2>

            <div className="grid grid-cols-1 gap-6 w-full max-w-6xl place-items-center">

                {proker.map((item, i) => (
                    <CardProker
                        key={i}
                        title={item.name}
                        description={item.description}
                    />
                ))}

            </div>
        </section>
    );
};

export default ProkerDepartment;