"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import type { RegisterState } from "../types/register";

export async function register(
  _state: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string" ||
    !email ||
    !password
  ) {
    return { error: "Podaj adres e-mail i hasło." };
  }

  if (password !== confirmPassword) {
    return { error: "Hasła nie są takie same." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: "Nie udało się utworzyć konta. Spróbuj ponownie." };
  }

  // A session is only returned when e-mail confirmation is disabled.
  if (data.session) {
    redirect("/");
  }

  return { confirmationSentTo: email };
}
