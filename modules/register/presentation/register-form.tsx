"use client";

import { Button } from "@/libs/ui/button";
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
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        required
      />

      <TextField
        label="Hasło"
        type="password"
        name="password"
        autoComplete="new-password"
        minLength={6}
        required
      />

      <TextField
        label="Powtórz hasło"
        type="password"
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
