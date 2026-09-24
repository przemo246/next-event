"use client";

import { useActionState } from "react";
import { Button } from "@/libs/ui/button";
import { ResendButton } from "@/shared/email-confirmation/presentation/resend-button";
import { Text } from "@/libs/ui/text";
import { login } from "../actions/login";

export const LoginForm = () => {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex flex-col gap-5">
      <form action={formAction} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <Text.Eyebrow>E-mail</Text.Eyebrow>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <Text.Eyebrow>Hasło</Text.Eyebrow>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className="border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent"
          />
        </label>

        {state?.error && <Text.Error>{state.error}</Text.Error>}

        <Button href="/resetuj-haslo" variant="link" className="-mt-2 self-start">
          Nie pamiętasz hasła?
        </Button>

        <Button type="submit" isDisabled={pending}>
          {pending ? "Logowanie…" : "Zaloguj się"}
        </Button>
      </form>
      {state?.unconfirmedEmail && (
        <ResendButton email={state.unconfirmedEmail} />
      )}
    </div>
  );
};
