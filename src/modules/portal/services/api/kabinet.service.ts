import { PaginatedResponse, simpleRequest } from "@/core/services/base.service";
import { AxiosInstance } from "axios";

export const kabinetService = {
  findAll: (client: AxiosInstance, is_active: boolean) =>
    simpleRequest<PaginatedResponse<KabinetItem>>("GET", "/kabinets")(client, {
      is_active: is_active ?? true,
    }),
};

export interface KabinetItem {
  id: string;
  name: string;
  year: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  visi: string | null;
  misi: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
