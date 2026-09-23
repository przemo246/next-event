import Link from "next/link";
import { Header } from "@/shared/header/presentation/header";
import { Text } from "@/libs/ui/text";
import { Container } from "./container";
import { Divider } from "./divider";
import { OAuthButtons } from "./oauth-buttons";
import { RegisterCard } from "./register-card";
import { Tabs } from "./tabs";

export const Main = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas font-body text-foreground">
      <Header />
      <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <Container className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Text.H1 className="mb-3">
              Znajdź swoje <Text.Accent>następne wydarzenie</Text.Accent>
            </Text.H1>
            <Text.Lead>
              Załóż konto, zapisuj ulubione wydarzenia i jako pierwszy dowiaduj
              się o aktualizacjach.
            </Text.Lead>
          </div>

          <RegisterCard
            intro={
              <>
                <OAuthButtons />
                <Divider />
                <Tabs />
              </>
            }
          />

          <Text.Caption className="mt-6 text-center">
            Rejestrując się, akceptujesz{" "}
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
