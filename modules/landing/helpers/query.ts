import type { QueryData, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types/db-schema";

const SELECT_COLUMNS =
  "id, name, city, street, starts_at, ends_at, image_path, link, category:event_categories(name), subcategory:event_subcategories(name)";

export const FEATURED_EVENTS_LIMIT = 4;

const buildFeaturedEventsQuery = (supabase: SupabaseClient<Database>) =>
  supabase
    .from("events")
    .select(SELECT_COLUMNS, { count: "exact" })
    .eq("is_featured", true)
    .order("starts_at", { ascending: true })
    .limit(FEATURED_EVENTS_LIMIT);

// PostgREST returns only the columns named in the select, so the row types are
// derived from the queries themselves rather than asserted to be full rows.
export type FeaturedEventRow =
  QueryData<ReturnType<typeof buildFeaturedEventsQuery>>[number];

export type FetchFeaturedEventsResult = {
  events: FeaturedEventRow[];
  total: number;
};

export const fetchFeaturedEvents = async (
  supabase: SupabaseClient<Database>,
): Promise<FetchFeaturedEventsResult> => {
  const { data, count, error } = await buildFeaturedEventsQuery(supabase);

  if (error) {
    console.error(
      "[Database Error] fetchFeaturedEvents failed:",
      error.message,
      error.details,
    );
    return { events: [], total: 0 };
  }

  return {
    events: data,
    total: count ?? data.length,
  };
};

const buildQuickFiltersQuery = (supabase: SupabaseClient<Database>) =>
  supabase
    .from("quick_filters")
    .select("id, name, date_from, date_to")
    .order("date_from", { ascending: true });

export type QuickFilterRow =
  QueryData<ReturnType<typeof buildQuickFiltersQuery>>[number];

export const fetchQuickFilters = async (
  supabase: SupabaseClient<Database>,
): Promise<QuickFilterRow[]> => {
  const { data, error } = await buildQuickFiltersQuery(supabase);

  if (error) {
    console.error(
      "[Database Error] fetchQuickFilters failed:",
      error.message,
      error.details,
    );
    return [];
  }

  return data;
};
