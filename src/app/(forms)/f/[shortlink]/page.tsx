import { redirect, notFound } from "next/navigation";
import type { ShortlinkResponse } from "@/modules/portal/services/api/form.service";

type Props = {
  params: Promise<{ shortlink: string }>;
};

const Page = async ({ params }: Props) => {
  const { shortlink } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

  let formUrl: string | null = null;

  try {
    const res = await fetch(`${apiUrl}/forms/s/${shortlink}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data: ShortlinkResponse = await res.json();
      formUrl = data?.form_url ?? null;
    }
  } catch {
    // network / parse error
  }

  if (!formUrl) {
    notFound();
  }

  redirect(formUrl!);
};

export default Page;
