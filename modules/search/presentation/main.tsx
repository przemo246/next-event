import { createClient } from "@/libs/supabase/server";
import { Header } from "@/shared/modules/header/presentation/header";
import { Text } from "@/libs/ui/text";

import {
  DEFAULT_PAGE_SIZE,
  parseFilters,
} from "../helpers/filters";
import type { RawSearchParams } from "../helpers/filters";
import { toSearchEvent } from "../helpers/mapper";
import { fetchEvents } from "../helpers/query";
import { CategoryFilter } from "./category-filter";
import { ResultsList } from "./results-list";
import { SearchForm } from "./search-form";
import { SortToggle } from "./sort-toggle";

type MainProps = {
  searchParams: RawSearchParams;
};

export const Main = async ({ searchParams }: MainProps) => {
  const filters = parseFilters(searchParams);
  const supabase = await createClient();
  const { events, hasMore } = await fetchEvents(supabase, filters, {
    offset: 0,
    limit: DEFAULT_PAGE_SIZE,
  });

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
          initialEvents={events.map(toSearchEvent)}
          initialHasMore={hasMore}
        />
      </main>
    </div>
  );
};
