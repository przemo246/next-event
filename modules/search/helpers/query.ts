import type { SupabaseClient } from "@supabase/supabase-js";

import type { EventFilters } from "./filters";

export type EventRow = {
  id: number;
  name: string;
  city: string;
  street: string;
  starts_at: string;
  ends_at: string | null;
  image_path: string | null;
  link: string | null;
  category: string;
  subcategory: string | null;
};

const SELECT_COLUMNS =
  "id, name, city, street, starts_at, ends_at, image_path, link, category, subcategory";

// Postgres' LIKE/ILIKE treats `%` and `_` as wildcards and `\` as its escape
// character, so a query containing them (e.g. "50%") has to be escaped before
// it reaches `ilike`, or it would match more than the user typed.
const escapeLikePattern = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");

const startOfDayUtc = (isoDate: string) => `${isoDate}T00:00:00.000Z`;

const exclusiveEndOfDayUtc = (isoDate: string) => {
  const date = new Date(startOfDayUtc(isoDate));

  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString();
};

export const buildEventsQuery = (
  supabase: SupabaseClient,
  filters: EventFilters,
) => {
  let query = supabase.from("events").select(SELECT_COLUMNS);

  if (filters.query) {
    query = query.ilike("name", `%${escapeLikePattern(filters.query)}%`);
  }

  if (filters.city) {
    query = query.eq("city", filters.city);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.subcategory) {
    query = query.eq("subcategory", filters.subcategory);
  }

  // With no explicit `dateFrom`, default to "from now" so the search page
  // shows upcoming events rather than its entire history.
  query = query.gte(
    "starts_at",
    filters.dateFrom ? startOfDayUtc(filters.dateFrom) : new Date().toISOString(),
  );

  if (filters.dateTo) {
    query = query.lt("starts_at", exclusiveEndOfDayUtc(filters.dateTo));
  }

  return query.order("starts_at", { ascending: filters.sort === "asc" });
};

export type FetchEventsResult = {
  events: EventRow[];
  hasMore: boolean;
};

export const fetchEvents = async (
  supabase: SupabaseClient,
  filters: EventFilters,
  { offset, limit }: { offset: number; limit: number },
): Promise<FetchEventsResult> => {
  // Range is inclusive, so asking for one row past `limit` tells us whether
  // there is more to load without a separate count query.
  const { data, error } = await buildEventsQuery(supabase, filters).range(
    offset,
    offset + limit,
  );

  if (error || !data) {
    return { events: [], hasMore: false };
  }

  return {
    events: data.slice(0, limit) as EventRow[],
    hasMore: data.length > limit,
  };
};
