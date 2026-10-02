import { redirect } from "next/navigation";
import { Main } from "@/modules/create-event/presentation/main";
import { getJWTClaims } from "@/libs/supabase/claims";

export const Module = async () => {
  const claims = await getJWTClaims();

  if (!claims) {
    redirect("/login");
  }

  return <Main />;
};
