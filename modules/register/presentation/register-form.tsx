"use client";

import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";
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
          autoComplete="new-password"
          minLength={6}
          required
          className="border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <Text.Eyebrow>Powtórz hasło</Text.Eyebrow>
        <input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={6}
          required
          className="border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent"
        />
      </label>

      {state && "error" in state && <Text.Error>{state.error}</Text.Error>}

      <Button type="submit" isDisabled={pending}>
        {pending ? "Rejestracja…" : "Zarejestruj się"}
      </Button>
    </form>
  );
};
