import type { Metadata } from "next";
import { Main } from "@/modules/search/presentation/main";

export const metadata: Metadata = {
  title: "Szukaj wydarzeń",
};

const Page = async ({ searchParams }: PageProps<"/search">) => {
  const params = await searchParams;

  return <Main searchParams={params} />;
};
export default Page;
