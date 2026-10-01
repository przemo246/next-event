"use client";

import { Button } from "@/libs/ui/button";
import { PasswordField } from "@/libs/ui/password-field";
import { Text } from "@/libs/ui/text";
import { TextField } from "@/libs/ui/text-field";
import type { RegisterState } from "../types/register";

type RegisterFormProps = {
  state: RegisterState;
  formAction: (formData: FormData) => void;
  pending: boolean;
};

export const RegisterForm = ({
  state,
  formAction,
  pending,
}: RegisterFormProps) => {
  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        label="Nazwa użytkownika"
        name="username"
        autoComplete="username"
        hint="3–30 znaków: małe litery, cyfry i podkreślenie."
        pattern="[a-zA-Z0-9_]+"
        minLength={3}
        maxLength={30}
        required
      />

      <TextField
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        required
      />

      {/* minLength is a browser hint only; the action has to enforce the same
          number. Keep the two in step with MIN_PASSWORD_LENGTH in
          ../helpers/validation -- not imported, because zod would ride along. */}
      <PasswordField
        label="Hasło"
        name="password"
        autoComplete="new-password"
        minLength={6}
        required
      />

      <PasswordField
        label="Powtórz hasło"
        name="confirmPassword"
        autoComplete="new-password"
        minLength={6}
        required
      />

      {state && "error" in state && <Text.Error>{state.error}</Text.Error>}

      <Button type="submit" isDisabled={pending}>
        {pending ? "Rejestracja…" : "Zarejestruj się"}
      </Button>
    </form>
  );
};
