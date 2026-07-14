"use client";

import AboutDepartment from "@/modules/portal/pages/section/department/about.department";
import { useState } from "react";
import MemberDepartment from "@/modules/portal/pages/section/department/member.department";
import ProkerDepartment from "@/modules/portal/pages/section/department/proker.department";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import { departmentService } from "@/modules/portal/services/api/department.service";

type PageProps = {
  slug: string;
};

const ModulePortalDepartmentPage = ({ slug }: PageProps) => {
  const [activeTab, setActiveTab] = useState<"team" | "program">("team");
  const axios = useAxios();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["department", slug],
    queryFn: async () => await departmentService.findBySlug(axios, slug),
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    console.error(`Failed to fetch department: ${slug}`);
  }

  const departmentData = data;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="relative flex flex-col items-center justify-center mx-auto max-w-xl px-4 pt-24 md:pt-48 pb-16">
          <div className="w-20 h-20 rounded-full bg-gray-200 mb-4" />
          <div className="h-8 w-48 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
          <div className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-4/6 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <>
      <AboutDepartment
        data={departmentData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "team" && <MemberDepartment data={departmentData} />}
      {activeTab === "program" && <ProkerDepartment data={departmentData} />}
    </>
  );
};

export default ModulePortalDepartmentPage;
