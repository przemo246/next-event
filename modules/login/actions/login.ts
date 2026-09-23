"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import type { LoginState } from "../types/login";

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    return { error: "Podaj adres e-mail i hasło." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error?.code === "email_not_confirmed") {
    return {
      error: "Najpierw potwierdź adres e-mail, klikając link z wiadomości.",
      unconfirmedEmail: email,
    };
  }

  if (error) {
    return { error: "Nieprawidłowy e-mail lub hasło." };
  }

  redirect("/");
}
