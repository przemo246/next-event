import type { Metadata } from "next";
import { Main } from "@/modules/create-event/presentation/main";

export const metadata: Metadata = {
  title: "Dodaj wydarzenie",
};

const Page = async () => {
  return <Main />;
};
export default Page;
