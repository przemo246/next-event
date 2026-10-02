import type { SupabaseClient } from "@supabase/supabase-js";

export type FeaturedEventRow = {
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

export const FEATURED_EVENTS_LIMIT = 4;

export type FetchFeaturedEventsResult = {
  events: FeaturedEventRow[];
  total: number;
};

export const fetchFeaturedEvents = async (
  supabase: SupabaseClient,
): Promise<FetchFeaturedEventsResult> => {
  const { data, count, error } = await supabase
    .from("events")
    .select(SELECT_COLUMNS, { count: "exact" })
    .eq("is_featured", true)
    .order("starts_at", { ascending: true })
    .limit(FEATURED_EVENTS_LIMIT);

  if (error || !data) {
    return { events: [], total: 0 };
  }

  return { events: data as FeaturedEventRow[], total: count ?? data.length };
};
