"use server";

import { createClient } from "@/core/supabase/server";
import type { ResendState } from "../types/resend";

export async function resendConfirmation(
  _state: ResendState,
  formData: FormData,
): Promise<ResendState> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    return { error: "Brak adresu e-mail." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });

  if (error?.code === "over_email_send_rate_limit") {
    return { error: "Wysłano zbyt wiele wiadomości. Spróbuj za chwilę." };
  }

  if (error) {
    return { error: "Nie udało się wysłać wiadomości. Spróbuj ponownie." };
  }

  return { sent: true };
}
