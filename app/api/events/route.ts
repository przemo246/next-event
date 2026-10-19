import type { NextRequest } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { fetchEventCategories } from "@/shared/modules/event-taxonomy/helpers/query";
import {
  DEFAULT_PAGE_SIZE,
  parseFilters,
  parseOffset,
} from "@/modules/search/helpers/filters";
import { toSearchEvent } from "@/modules/search/helpers/mapper";
import { fetchEvents } from "@/modules/search/helpers/query";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const supabase = await createClient();
  // Same two steps as the page: validate the slugs against the taxonomy, then
  // resolve them to ids. A "load more" request cannot trust the filters it was
  // handed — they came back through a URL.
  const categories = await fetchEventCategories(supabase);
  const filters = parseFilters(Object.fromEntries(searchParams), categories);
  const offset = parseOffset(searchParams.get("offset"));

  const { events, hasMore } = await fetchEvents(supabase, filters, categories, {
    offset,
    limit: DEFAULT_PAGE_SIZE,
  });

  return Response.json({ events: events.map(toSearchEvent), hasMore });
}
