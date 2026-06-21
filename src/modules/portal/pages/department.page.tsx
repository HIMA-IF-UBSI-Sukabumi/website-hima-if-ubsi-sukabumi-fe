'use client';

import AboutDepartment from "@/modules/portal/pages/section/department/about.department";
import {DEPARTMENT_DATA} from "@/constants/department";
import {useState} from "react";
import MemberDepartment from "@/modules/portal/pages/section/department/member.department";
import ProkerDepartment from "@/modules/portal/pages/section/department/proker.department";

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
            {activeTab === "program" && <ProkerDepartment data={departmentData}/>}
        </>
    )
}

export default ModulePortalDepartmentPage;