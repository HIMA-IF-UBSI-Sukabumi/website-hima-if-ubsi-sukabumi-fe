import { simpleRequest } from "@/core/services/base.service";
import type { SocialMediaLinks } from "@/core/types/social-media";
import { AxiosInstance } from "axios";

export const bphService = {
  findAll: (client: AxiosInstance) =>
    simpleRequest<BphItem[]>("GET", "/bph")(client),
};

export interface BphItem {
  id: string;
  title: string;
  name: string;
  image: string;
  social_media?: SocialMediaLinks | null;
}
