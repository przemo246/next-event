"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import type { RegisterState } from "../types/register";
import { usernameSchema } from "../validation";

export async function register(
  _state: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const rawUsername = formData.get("username");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string" ||
    !email ||
    !password
  ) {
    return { error: "Podaj adres e-mail i hasło." };
  }

  const parsedUsername = usernameSchema.safeParse(
    typeof rawUsername === "string" ? rawUsername : "",
  );

  if (!parsedUsername.success) {
    return {
      error:
        parsedUsername.error.issues[0]?.message ??
        "Podaj poprawną nazwę użytkownika.",
    };
  }

  const username = parsedUsername.data;

  if (password !== confirmPassword) {
    return { error: "Hasła nie są takie same." };
  }

  const supabase = await createClient();

  // Checked before sign-up rather than after: a duplicate handle aborts the
  // sign-up with HTTP 500, and @supabase/auth-js reports every 5xx as a
  // retryable error without reading the Postgres code, so the failure is not
  // distinguishable afterwards. The unique index still has the final say, which
  // only matters if two people submit the same handle at the same moment.
  const { data: taken } = await supabase.rpc("username_is_taken", {
    candidate: username,
  });

  if (taken) {
    return { error: "Ta nazwa użytkownika jest zajęta. Wybierz inną." };
  }

  // The handle travels as sign-up user metadata; the handle_new_user trigger
  // reads it while creating the profile.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    return { error: "Nie udało się utworzyć konta. Spróbuj ponownie." };
  }

  // A session is only returned when e-mail confirmation is disabled.
  if (data.session) {
    redirect("/");
  }

  return { confirmationSentTo: email };
}
