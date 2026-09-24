"use client";

import { useActionState, useEffect, useState } from "react";

import { Button } from "@/libs/ui/button";
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
      <Button
        type="submit"
        variant="link"
        isDisabled={pending || cooldown > 0}
        className="self-start"
      >
        {pending
          ? "Wysyłanie…"
          : cooldown > 0
            ? `Wyślij ponownie (${cooldown} s)`
            : "Wyślij link ponownie"}
      </Button>
      {state && "error" in state && (
        <Text.Error>{state.error}</Text.Error>
      )}
      {state && "sent" in state && (
        <Text.Small>Wysłaliśmy nowy link.</Text.Small>
      )}
    </form>
  );
};
