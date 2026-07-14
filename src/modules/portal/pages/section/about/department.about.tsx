"use client";

import CardDepartment from "@/modules/portal/components/CardDepartment";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import { departmentService } from "@/modules/portal/services/api/department.service";
import { getStorageUrl } from "@/lib/utils";

const DepartmentAbout = () => {
  const axios = useAxios();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => await departmentService.findAll(axios),
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    console.error("Failed to fetch department list");
  }

  const storageUrl = getStorageUrl();
  const departmentList = data ?? [];

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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-85 rounded-4xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-start">
            {departmentList.map((item, i) => (
              <CardDepartment
                key={i}
                id={i + 1}
                title={item.title}
                description={item.description ?? ""}
                logo={item.logo ? `${storageUrl}/${item.logo}` : ""}
                color={item.color ?? "#000000"}
                href={item.slug ? "/department/" + item.slug : "#"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DepartmentAbout;
