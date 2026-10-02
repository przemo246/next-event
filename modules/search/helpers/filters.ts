import { EVENT_CATEGORY_NAMES, subcategoriesFor } from "@/shared/data/event-categories";

// Lenient parsing on purpose: unlike `create-event`'s validation, there is no
// user to show an error to here — an invalid or missing param just falls back
// to "no filter" instead of failing the whole page.
export type RawSearchParams = Record<string, string | string[] | undefined>;

export type SortDirection = "asc" | "desc";

export type EventFilters = {
  query: string;
  city: string;
  dateFrom: string;
  dateTo: string;
  category: string;
  subcategory: string;
  sort: SortDirection;
};

export const DEFAULT_PAGE_SIZE = 20;

const MAX_QUERY_LENGTH = 200;

const first = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const parseFilters = (params: RawSearchParams): EventFilters => {
  const query = first(params.query).slice(0, MAX_QUERY_LENGTH);
  const city = first(params.city);
  const dateFrom = first(params.dateFrom);
  const dateTo = first(params.dateTo);
  const sort: SortDirection = first(params.sort) === "desc" ? "desc" : "asc";

  const categoryCandidate = first(params.category);
  const category = EVENT_CATEGORY_NAMES.includes(categoryCandidate)
    ? categoryCandidate
    : "";

  // A subcategory is only kept when it actually belongs to the resolved
  // category — e.g. a leftover `subcategory=Rock` from a previous search is
  // dropped once `category` is cleared or switched to "Teatr".
  const subcategoryCandidate = first(params.subcategory);
  const allowedSubcategories = category ? subcategoriesFor(category) : undefined;
  const subcategory = allowedSubcategories?.includes(subcategoryCandidate)
    ? subcategoryCandidate
    : "";

  return {
    query,
    city,
    dateFrom: isIsoDate(dateFrom) ? dateFrom : "",
    dateTo: isIsoDate(dateTo) ? dateTo : "",
    category,
    subcategory,
    sort,
  };
};

export const parseOffset = (value: string | null | undefined): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
};
