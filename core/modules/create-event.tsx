import { redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import { Main } from "@/modules/create-event/presentation/main";

export const Module = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  return <Main />;
};
