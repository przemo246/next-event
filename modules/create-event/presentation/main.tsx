import { Header } from "@/shared/modules/header/presentation/header";
import { Text } from "@/libs/ui/text";
import { CreateEventForm } from "./create-event-form";

export const Main = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas font-body text-foreground">
      <Header />
      <main className="flex flex-1 justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <Text.H1 className="mb-3">
              Dodaj <Text.Accent>wydarzenie</Text.Accent>
            </Text.H1>
            <Text.Lead>
              Wypełnij poniższy formularz, aby opublikować swoje wydarzenie.
            </Text.Lead>
          </div>

          <div className="border border-border bg-canvas-raised p-8">
            <CreateEventForm />
          </div>
        </div>
      </main>
    </div>
  );
};
