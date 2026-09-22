"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/libs/ui/button";
import { login } from "../actions/login";

export const LoginForm = () => {
  const [state, formAction, pending] = useActionState(login, undefined);

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
          autoComplete="current-password"
          required
          className="border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent"
        />
      </label>

      {state?.error && <p className="text-sm text-accent">{state.error}</p>}

      <Link
        href="/resetuj-haslo"
        className="-mt-2 text-sm font-bold text-foreground-secondary underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent"
      >
        Nie pamiętasz hasła?
      </Link>

      <Button type="submit" isDisabled={pending}>
        {pending ? "Logowanie…" : "Zaloguj się"}
      </Button>
    </form>
  );
};
