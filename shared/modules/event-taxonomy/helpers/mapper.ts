import type { EventCategoryRow } from "./query";
import type { EventCategory } from "../types/event-category";

// An embedded collection comes back in whatever order PostgREST feels like, so
// `position` — the column an editor reorders the taxonomy with — is applied
// here rather than in the query.
export const toEventCategory = (row: EventCategoryRow): EventCategory => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  subcategories: [...row.event_subcategories]
    .sort((a, b) => a.position - b.position)
    .map(({ id, name, slug }) => ({ id, name, slug })),
});
