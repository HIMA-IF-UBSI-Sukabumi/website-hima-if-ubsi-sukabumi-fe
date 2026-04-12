import {DepartmentDataProps} from "@/constants/department";
import CardBph from "@/modules/portal/components/CardBph";
import CardMember from "@/modules/portal/components/CardMember";

type Props = {
    data?: DepartmentDataProps;
}

const MemberDepartment = ({data}: Props) => {
    const leader = data?.team?.find(member => member.isLeader);
    const member = data?.team?.filter(member => !member.isLeader) || [];

    const groupDivision = member?.reduce((acc, member) => {
        const division = member.division || 'Lainnya'

        if (!acc[division]) {
            acc[division] = [];
        }

        acc[division].push(member);
        return acc;
    }, {} as Record<string, typeof member>)

    return (
        <section className={'relative overflow-hidden flex flex-col items-center pb-20'}>
            {leader && (
                <div className={'text-center'}>
                    <CardBph imageUrl={leader?.img} title={leader.division} name={leader.name}/>
                </div>
            )}

            {groupDivision && Object.entries(groupDivision).map(([division, members]) => (
                <div key={division} className={'w-full max-w-5xl'}>
                    <h3 className="text-center font-bold text-2xl my-10">
                        {division}
                    </h3>

                    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                        {members.map((member, i) => (
                            <CardMember key={i} imageUrl={member.img} name={member.name} />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}

export default MemberDepartment;