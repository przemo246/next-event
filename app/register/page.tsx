import type { Metadata } from "next";
import { Main } from "@/modules/register/presentation/main";

export const metadata: Metadata = {
  title: "Zarejestruj się",
};

const Page = () => {
  return <Main />;
};
export default Page;
