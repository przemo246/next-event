import type { Metadata } from "next";
import { Module } from "@/core/modules/login";

export const metadata: Metadata = {
  title: "Zaloguj się",
};

const Page = async ({ searchParams }: PageProps<"/login">) => {
  const { error } = await searchParams;

  return <Module linkError={error === "confirm"} />;
};
export default Page;
