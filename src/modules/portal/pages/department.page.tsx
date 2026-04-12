'use client';

import AboutDepartment from "@/modules/portal/pages/section/department/about.department";
import {DEPARTMENT_DATA} from "@/constants/department";
import {useState} from "react";
import MemberDepartment from "@/modules/portal/pages/section/department/member.department";

type PageProps = {
    slug: string;
}

const ModulePortalDepartmentPage = ({slug}: PageProps) => {
    const [activeTab, setActiveTab] = useState<"team" | "program">("team")
    const departmentData = DEPARTMENT_DATA.find(department => department.slug === slug);

    return (
        <>
            <AboutDepartment
                data={departmentData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {activeTab === "team" && <MemberDepartment data={departmentData}/>}
            {activeTab === "program" && (
                <section className={'relative overflow-hidden flex flex-col items-center pb-20'}>
                    belom ada
                </section>
            )}
        </>
    )
}

export default ModulePortalDepartmentPage;