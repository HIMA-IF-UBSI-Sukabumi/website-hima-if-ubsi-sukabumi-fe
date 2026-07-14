"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/core/hooks/use-axios";
import { kabinetService } from "@/modules/portal/services/api/kabinet.service";
import { getStorageUrl } from "@/lib/utils";

const CabinetLanding = () => {
  const pathname = usePathname();
  const axios = useAxios();

  const { data } = useQuery({
    queryKey: ["kabinet-active"],
    queryFn: async () => await kabinetService.findAll(axios, true),
    staleTime: 10 * 60 * 1000,
  });

  const storageUrl = getStorageUrl();
  const kabinet = data?.data?.find((k) => k.is_active) ?? data?.data?.[0];
  const logoUrl = kabinet?.logo
    ? `${storageUrl}/${kabinet.logo}`
    : "https://placehold.co/1080x1080.png";

  const name = kabinet?.name;
  const year = kabinet?.year;
  const visi = kabinet?.visi;
  const misi = kabinet?.misi;
  const description = kabinet?.description;

  return (
    <section className={"relative overflow-hidden mt-14 md:mt-0"}>
      <img
        src={"/assets/aurora-blob.webp"}
        className={"absolute -left-120 top-0 -z-20 w-auto"}
      />

      <img
        src={"/assets/aurora-blob.webp"}
        className={"absolute -right-120 top-0 -z-20 w-auto"}
      />

      <div className="relative flex flex-col items-center justify-center mx-auto max-w-7xl px-4 py-24 md:py-48 sm:px-6 lg:px-8 gap-8 text-center">
        <h3 className="text-3xl text-secondary font-light">
          Periode Tahun {year}
        </h3>
        <div className={"flex flex-col items-center"}>
          <div>
            <h1 className="font-archivo text-4xl sm:text-6xl md:text-7xl xl:text-8xl uppercase text-black tracking-wide leading-none">
              {name}
            </h1>
          </div>

          <img
            src={logoUrl}
            className={"object-contain pointer-events-none"}
            alt={`Logo Kabinet ${name}`}
          />

          {pathname === "/about" && (
            <div
              dangerouslySetInnerHTML={{ __html: description! }}
              className="mt-4 mb-8 max-w-3xl text-lg md:text-2xl text-black text-center"
            ></div>
          )}

          <div
            className={
              "max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 px-0 md:px-8"
            }
          >
            <div
              className={"border border-tertiary rounded-t-4xl px-16 w-full"}
            >
              <div
                className={
                  "flex flex-col items-center justify-center py-24 gap-4 h-full"
                }
              >
                <h1
                  className={
                    "font-black text-5xl italic underline text-secondary"
                  }
                >
                  VISI
                </h1>
                <div dangerouslySetInnerHTML={{ __html: visi! }}></div>
              </div>
            </div>
            <div
              className={"border border-tertiary rounded-t-4xl px-16 w-full"}
            >
              <div
                className={
                  "flex flex-col items-center justify-center py-24 gap-4 h-full"
                }
              >
                <h1
                  className={
                    "font-black text-5xl italic underline text-secondary"
                  }
                >
                  MISI
                </h1>
                {misi ? (
                  <div dangerouslySetInnerHTML={{ __html: misi }}></div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CabinetLanding;
