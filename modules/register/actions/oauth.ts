"use server";

import type { Provider } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";

const signInWithProvider = async (provider: Provider) => {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/register?error=oauth");
  }

  redirect(data.url);
};

export async function signInWithGoogle() {
  await signInWithProvider("google");
}

export async function signInWithFacebook() {
  await signInWithProvider("facebook");
}
