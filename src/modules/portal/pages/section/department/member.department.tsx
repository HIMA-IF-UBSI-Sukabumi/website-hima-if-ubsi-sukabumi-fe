import {DepartmentDataProps} from "@/constants/department";
import CardBph from "@/modules/portal/components/CardBph";
import CardMember from "@/modules/portal/components/CardMember";

type Props = {
    data?: DepartmentDataProps;
};

const MemberDepartment = ({data}: Props) => {
    const leader = data?.team?.find(member => member.isLeader);
    const members = data?.team?.filter(member => !member.isLeader) || [];

    const groupDivision = members.reduce((acc, member) => {
        const division = member.division || "Lainnya";

        if (!acc[division]) {
            acc[division] = [];
        }

        acc[division].push(member);
        return acc;
    }, {} as Record<string, typeof members>);

    return (
        <section className="relative overflow-hidden flex flex-col items-center pb-20 px-4">
            {leader && (
                <div className="flex justify-center mb-10 w-full">
                    <CardBph
                        imageUrl={leader.img}
                        title={leader.division}
                        name={leader.name}
                    />
                </div>
            )}

            {groupDivision &&
                Object.entries(groupDivision).map(([division, members]) => {
                    const count = members.length;

                    const gridClass =
                        count === 1
                            ? "grid-cols-1"
                            : count === 2
                                ? "grid-cols-1 md:grid-cols-2"
                                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

                    return (
                        <div key={division} className="w-full max-w-2xl mb-12">
                            <h3 className="text-center font-bold text-2xl my-10">
                                {division}
                            </h3>

                            <div
                                className={`grid ${gridClass} gap-6 justify-items-center`}
                            >
                                {members.map((member, i) => (
                                    <div key={i} className="flex justify-center w-full">
                                        <CardMember
                                            imageUrl={member.img}
                                            name={member.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
        </section>
    );
};

export default MemberDepartment;