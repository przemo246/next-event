import Link from "next/link";
import { Header } from "@/shared/header/presentation/header";
import { Text } from "@/libs/ui/text";
import { Container } from "./container";
import { Divider } from "./divider";
import { LoginForm } from "./login-form";
import { OAuthButtons } from "./oauth-buttons";
import { Tabs } from "./tabs";

type MainProps = {
  linkError?: boolean;
};

export const Main = ({ linkError = false }: MainProps) => {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas font-body text-foreground">
      <Header />
      <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <Container className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Text.H1 className="mb-3">
              Wróć do <Text.Accent>odkrywania wydarzeń</Text.Accent>
            </Text.H1>
            <Text.Lead>
              Zapisuj wydarzenia, śledź ceny i jako pierwszy dowiaduj się o
              aktualizacjach.
            </Text.Lead>
          </div>

          <div className="flex flex-col gap-6 border border-border bg-canvas-raised p-8">
            <OAuthButtons />
            <Divider />
            <Tabs />
            {linkError && (
              <Text.Error className="border border-danger px-4 py-3">
                Link aktywacyjny wygasł lub jest nieprawidłowy. Zaloguj się, aby
                otrzymać nowy.
              </Text.Error>
            )}
            <LoginForm />
          </div>

          <Text.Caption className="mt-6 text-center">
            Logując się, akceptujesz{" "}
            <Link
              href="/regulamin"
              className="text-foreground-muted underline decoration-border-strong underline-offset-4 hover:text-accent"
            >
              regulamin serwisu
            </Link>{" "}
            Afisz.
          </Text.Caption>
        </Container>
      </div>
    </div>
  );
};
