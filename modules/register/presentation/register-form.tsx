"use client";

import { useActionState } from "react";
import { Button } from "@/libs/ui/button";
import { register } from "../actions/register";

export const RegisterForm = () => {
  const [state, formAction, pending] = useActionState(register, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] tracking-widest text-foreground-muted uppercase">
          E-mail
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className="border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] tracking-widest text-foreground-muted uppercase">
          Hasło
        </span>
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
        <span className="font-mono text-[11px] tracking-widest text-foreground-muted uppercase">
          Powtórz hasło
        </span>
        <input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={6}
          required
          className="border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent"
        />
      </label>

      {state?.error && <p className="text-sm text-accent">{state.error}</p>}

      <Button type="submit" isDisabled={pending}>
        {pending ? "Rejestracja…" : "Zarejestruj się"}
      </Button>
    </form>
  );
};
