import { simpleRequest } from "@/core/services/base.service";
import { AxiosInstance } from "axios";

export const departmentService = {
  findAll: (client: AxiosInstance) =>
    simpleRequest<DepartmentDetail[]>("GET", "/departemens")(client),
  findBySlug: (client: AxiosInstance, slug: string) =>
    simpleRequest<DepartmentDetail>("GET", `/departemens/${slug}`)(client),
};

export interface DepartmentTeamMember {
  name: string;
  img: string | null;
  isLeader: boolean;
  division: string;
}

export interface DepartmentProgram {
  name: string;
  description: string;
}

export interface DepartmentDetail {
  title: string;
  description: string | null;
  logo: string | null;
  color: string | null;
  slug: string | null;
  team: DepartmentTeamMember[];
  programs: DepartmentProgram[];
}
