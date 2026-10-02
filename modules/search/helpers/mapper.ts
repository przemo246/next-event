import type { EventRow } from "./query";
import type { SearchEvent } from "../types/search-event";

export const toSearchEvent = (row: EventRow): SearchEvent => ({
  id: row.id,
  name: row.name,
  city: row.city,
  street: row.street,
  startsAt: row.starts_at,
  endsAt: row.ends_at,
  imagePath: row.image_path,
  link: row.link,
  category: row.category,
  subcategory: row.subcategory,
});
