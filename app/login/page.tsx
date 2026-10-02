import type { Metadata } from "next";
import { Main } from "@/modules/login/presentation/main";

export const metadata: Metadata = {
  title: "Zaloguj się",
};

const Page = async ({ searchParams }: PageProps<"/login">) => {
  const { error } = await searchParams;

  return <Main linkError={error === "confirm"} />;
};
export default Page;
