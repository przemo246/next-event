import type { Metadata } from "next";
import { Module } from "@/core/modules/create-event";

export const metadata: Metadata = {
  title: "Dodaj wydarzenie",
};

const Page = async () => {
  return <Module />;
};
export default Page;
