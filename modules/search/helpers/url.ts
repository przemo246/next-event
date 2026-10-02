import type { EventFilters } from "./filters";

// Builds a `/search` link that keeps every current filter except the ones
// being overridden — e.g. clicking a category keeps `query`/`city`/dates
// intact and only changes `category`/`subcategory`.
export const buildSearchHref = (
  filters: EventFilters,
  overrides: Partial<EventFilters>,
): string => {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(merged)) {
    if (value && !(key === "sort" && value === "asc")) {
      params.set(key, value);
    }
  }

  const search = params.toString();

  return search ? `/search?${search}` : "/search";
};
