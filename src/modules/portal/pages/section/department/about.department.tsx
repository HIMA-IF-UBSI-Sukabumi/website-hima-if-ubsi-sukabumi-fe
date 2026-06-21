import {DepartmentDataProps} from "@/constants/department";
import React from "react";

type Props = {
    data?: DepartmentDataProps;
    activeTab?: string;
    setActiveTab?: React.Dispatch<React.SetStateAction<"team" | "program">>;
}

const AboutDepartment = ({data, activeTab, setActiveTab}: Props) => {
    return (
        <section className={'relative overflow-hidden mt-14 md:mt-0'}>
            <div className="relative flex flex-col items-center justify-center mx-auto max-w-xl px-4 pt-24 md:pt-48 pb-16 sm:px-6 lg:px-8 text-center">
                <div
                    className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow"
                    style={{
                        backgroundColor: data?.color
                    }}
                >
                    <img src={data?.logo} className="w-10"/>
                </div>

                <h1 className="text-3xl font-extrabold">{data?.title}</h1>

                <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                    {data?.description}
                </p>

                <div className="mt-6 bg-gray-100 rounded-xl p-2 flex">
                    <button
                        onClick={() => setActiveTab ? setActiveTab("team") : undefined}
                        className={`px-6 py-2 rounded-lg text-sm transition ${
                            activeTab === "team"
                                ? `text-white shadow`
                                : "text-gray-500"
                        }`}
                        style={{
                            backgroundColor: activeTab === "team" ? data?.color : undefined
                        }}
                    >
                        Tim
                    </button>

                    <button
                        onClick={() => setActiveTab ? setActiveTab("program") : undefined}
                        className={`px-6 py-2 rounded-lg text-sm transition ${
                            activeTab === "program"
                                ? "text-white shadow"
                                : "text-gray-500"
                        }`}
                        style={{
                            backgroundColor: activeTab === "program" ? data?.color : undefined
                        }}
                    >
                        Program Kerja
                    </button>
                </div>
            </div>
        </section>
    )
}

export default AboutDepartment;