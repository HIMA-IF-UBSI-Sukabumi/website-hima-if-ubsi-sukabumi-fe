"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import { departmentService } from "@/modules/portal/services/api/department.service";

const DepartmentLanding = () => {
  const axios = useAxios();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => await departmentService.findAll(axios),
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    console.error("Failed to fetch department list");
  }

  const departmentList = data ?? [];

  return (
    <section className={"w-full py-28"}>
      <div className={"max-w-7xl mx-auto px-6"}>
        <div className={"flex flex-col items-center justify-center"}>
          <h1 className={"text-3xl uppercase text-secondary"}>Departmen</h1>

          {isLoading ? (
            <div
              className={
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 animate-pulse"
              }
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={
                    "border-t-3 border-t-secondary px-24 py-16 bg-gray-200 h-32"
                  }
                />
              ))}
            </div>
          ) : (
            <div
              className={
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
              }
            >
              {departmentList.map((department, i) => (
                <Link href={"/department/" + department.slug} key={i}>
                  <div
                    className={
                      "border-t-3 border-t-secondary px-24 py-16 flex flex-col items-center justify-center bg-linear-to-b from-tertiary/50 to-white"
                    }
                  >
                    <h1
                      className={
                        "text-4xl font-black text-center uppercase text-primary"
                      }
                    >
                      {department.title}
                    </h1>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DepartmentLanding;
