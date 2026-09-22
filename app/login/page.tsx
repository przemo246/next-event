import type { Metadata } from "next";
import { Module } from "@/core/modules/login";

export const metadata: Metadata = {
  title: "Zaloguj się",
};

const Page = () => {
  return <Module />;
};
export default Page;
