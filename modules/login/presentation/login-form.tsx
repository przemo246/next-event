"use client";

import { useActionState } from "react";
import { Button } from "@/libs/ui/button";
import { PasswordField } from "@/libs/ui/password-field";
import { ResendButton } from "@/shared/modules/email-confirmation/presentation/resend-button";
import { Text } from "@/libs/ui/text";
import { TextField } from "@/libs/ui/text-field";
import { login } from "../actions/login";

export const LoginForm = () => {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex flex-col gap-5">
      <form action={formAction} className="flex flex-col gap-5">
        <TextField
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          required
        />

        <PasswordField
          label="Hasło"
          name="password"
          autoComplete="current-password"
          required
        />

        {state?.error && <Text.Error>{state.error}</Text.Error>}

        <Button
          href="/resetuj-haslo"
          variant="link"
          className="-mt-2 self-start"
        >
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
