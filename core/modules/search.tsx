import { createClient } from "@/libs/supabase/server";
import {
  DEFAULT_PAGE_SIZE,
  parseFilters,
} from "@/modules/search/helpers/filters";
import { toSearchEvent } from "@/modules/search/helpers/mapper";
import { fetchEvents } from "@/modules/search/helpers/query";
import { Main } from "@/modules/search/presentation/main";
import type { RawSearchParams } from "@/modules/search/helpers/filters";

type ModuleProps = {
  searchParams: RawSearchParams;
};

export const Module = async ({ searchParams }: ModuleProps) => {
  const filters = parseFilters(searchParams);
  const supabase = await createClient();
  const { events, hasMore } = await fetchEvents(supabase, filters, {
    offset: 0,
    limit: DEFAULT_PAGE_SIZE,
  });

  return (
    <Main
      filters={filters}
      initialEvents={events.map(toSearchEvent)}
      initialHasMore={hasMore}
    />
  );
};
