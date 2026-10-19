import type { QueryData, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types/db-schema";

import { toEventCategory } from "./mapper";
import type { EventCategory } from "../types/event-category";

const SELECT_COLUMNS =
  "id, name, slug, position, event_subcategories(id, name, slug, position)";

const buildEventCategoriesQuery = (supabase: SupabaseClient<Database>) =>
  supabase
    .from("event_categories")
    .select(SELECT_COLUMNS)
    .order("position", { ascending: true });

export type EventCategoryRow =
  QueryData<ReturnType<typeof buildEventCategoriesQuery>>[number];

// The single read of the taxonomy, shared by the create-event form and the
// search filters. It is read per request on purpose: editing a row in the
// dashboard is meant to be enough to change the site, with no redeploy.
export const fetchEventCategories = async (
  supabase: SupabaseClient<Database>,
): Promise<EventCategory[]> => {
  const { data, error } = await buildEventCategoriesQuery(supabase);

  if (error) {
    console.error(
      "[Database Error] fetchEventCategories failed:",
      error.message,
      error.details,
    );
    return [];
  }

  return data.map(toEventCategory);
};
