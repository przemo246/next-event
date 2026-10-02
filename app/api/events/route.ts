import type { NextRequest } from "next/server";
import { createClient } from "@/libs/supabase/server";
import {
  DEFAULT_PAGE_SIZE,
  parseFilters,
  parseOffset,
} from "@/modules/search/helpers/filters";
import { toSearchEvent } from "@/modules/search/helpers/mapper";
import { fetchEvents } from "@/modules/search/helpers/query";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filters = parseFilters(Object.fromEntries(searchParams));
  const offset = parseOffset(searchParams.get("offset"));

  const supabase = await createClient();
  const { events, hasMore } = await fetchEvents(supabase, filters, {
    offset,
    limit: DEFAULT_PAGE_SIZE,
  });

  return Response.json({ events: events.map(toSearchEvent), hasMore });
}
