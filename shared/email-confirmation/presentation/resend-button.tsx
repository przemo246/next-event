"use client";

import { useActionState, useEffect, useState } from "react";

import { Text } from "@/libs/ui/text";
import { resendConfirmation } from "../actions/resend";
import type { ResendState } from "../types/resend";

const COOLDOWN_SECONDS = 60;

type ResendButtonProps = {
  email: string;
  // Start in cooldown when a confirmation e-mail has just been sent.
  justSent?: boolean;
};

export const ResendButton = ({
  email,
  justSent = false,
}: ResendButtonProps) => {
  const [cooldown, setCooldown] = useState(justSent ? COOLDOWN_SECONDS : 0);

  const [state, formAction, pending] = useActionState(
    async (prev: ResendState, formData: FormData) => {
      const result = await resendConfirmation(prev, formData);
      if (result && "sent" in result) {
        setCooldown(COOLDOWN_SECONDS);
      }
      return result;
    },
    undefined,
  );

  useEffect(() => {
    if (cooldown <= 0) return;
    const timeout = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={pending || cooldown > 0}
        className="cursor-pointer self-start text-sm font-bold text-foreground-secondary underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:text-foreground-secondary"
      >
        {pending
          ? "Wysyłanie…"
          : cooldown > 0
            ? `Wyślij ponownie (${cooldown} s)`
            : "Wyślij link ponownie"}
      </button>
      {state && "error" in state && (
        <Text.Error>{state.error}</Text.Error>
      )}
      {state && "sent" in state && (
        <Text.Small>Wysłaliśmy nowy link.</Text.Small>
      )}
    </form>
  );
};
