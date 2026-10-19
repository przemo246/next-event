import {
  findCategoryBySlug,
  findSubcategoryBySlug,
} from "@/shared/modules/event-taxonomy/helpers/selection";
import type { EventCategory } from "@/shared/modules/event-taxonomy/types/event-category";

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

// Filters carry slugs, not ids or display names, because they end up in the
// URL: a label can then be reworded without invalidating a shared link. The
// taxonomy is passed in rather than imported so this stays pure and testable.
export const parseFilters = (
  params: RawSearchParams,
  taxonomy: readonly EventCategory[],
): EventFilters => {
  const query = first(params.query).slice(0, MAX_QUERY_LENGTH);
  const city = first(params.city);
  const dateFrom = first(params.dateFrom);
  const dateTo = first(params.dateTo);
  const sort: SortDirection = first(params.sort) === "desc" ? "desc" : "asc";

  const category = findCategoryBySlug(taxonomy, first(params.category));

  // A subcategory is only kept when it actually belongs to the resolved
  // category — e.g. a leftover `subcategory=rock` from a previous search is
  // dropped once `category` is cleared or switched to "teatr".
  const subcategory = category
    ? findSubcategoryBySlug(category, first(params.subcategory))
    : undefined;

  return {
    query,
    city,
    dateFrom: isIsoDate(dateFrom) ? dateFrom : "",
    dateTo: isIsoDate(dateTo) ? dateTo : "",
    category: category?.slug ?? "",
    subcategory: subcategory?.slug ?? "",
    sort,
  };
};

export const parseOffset = (value: string | null | undefined): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
};
