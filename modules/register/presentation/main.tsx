import Link from "next/link";
import { Header } from "@/shared/header/presentation/header";
import { Container } from "./container";
import { Divider } from "./divider";
import { OAuthButtons } from "./oauth-buttons";
import { RegisterForm } from "./register-form";
import { Tabs } from "./tabs";

export const Main = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas font-body text-foreground">
      <Header />
      <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <Container className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-3 font-display text-4xl leading-tight font-extrabold tracking-tight">
              Znajdź swoje <span className="text-accent">następne wydarzenie</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-foreground-secondary">
              Załóż konto, zapisuj ulubione wydarzenia i jako pierwszy
              dowiaduj się o aktualizacjach.
            </p>
          </div>

          <div className="flex flex-col gap-6 border border-border bg-canvas-raised p-8">
            <OAuthButtons />
            <Divider />
            <Tabs />
            <RegisterForm />
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-foreground-faint">
            Rejestrując się, akceptujesz{" "}
            <Link
              href="/regulamin"
              className="text-foreground-muted underline decoration-border-strong underline-offset-4 hover:text-accent"
            >
              regulamin serwisu
            </Link>{" "}
            Afisz.
          </p>
        </Container>
      </div>
    </div>
  );
};
