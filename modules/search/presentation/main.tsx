import { Header } from "@/shared/modules/header/presentation/header";
import { Text } from "@/libs/ui/text";

import type { EventFilters } from "../helpers/filters";
import type { SearchEvent } from "../types/search-event";
import { CategoryFilter } from "./category-filter";
import { ResultsList } from "./results-list";
import { SearchForm } from "./search-form";
import { SortToggle } from "./sort-toggle";

type MainProps = {
  filters: EventFilters;
  initialEvents: SearchEvent[];
  initialHasMore: boolean;
};

export const Main = ({ filters, initialEvents, initialHasMore }: MainProps) => {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas font-body text-foreground">
      <Header />

      <main className="page-container flex flex-1 flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="flex flex-col gap-6">
          <Text.H1>
            Szukaj <Text.Accent>wydarzeń</Text.Accent>
          </Text.H1>

          <SearchForm filters={filters} />
          <CategoryFilter filters={filters} />
        </div>

        <div className="flex items-center justify-end">
          <SortToggle filters={filters} />
        </div>

        <ResultsList
          filters={filters}
          initialEvents={initialEvents}
          initialHasMore={initialHasMore}
        />
      </main>
    </div>
  );
};
