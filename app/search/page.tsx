import type { Metadata } from "next";
import { Module } from "@/core/modules/search";

export const metadata: Metadata = {
  title: "Szukaj wydarzeń",
};

const Page = async ({ searchParams }: PageProps<"/search">) => {
  const params = await searchParams;

  return <Module searchParams={params} />;
};
export default Page;
