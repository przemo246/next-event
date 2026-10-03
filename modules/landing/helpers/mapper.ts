import type { FeaturedEventRow, QuickFilterRow } from "./query";
import type { FeaturedEvent } from "../types/featured-event";
import type { QuickFilter } from "../types/quick-filter";
import { buildQuickFilterHref } from "./url";

export const toFeaturedEvent = (row: FeaturedEventRow): FeaturedEvent => ({
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

export const toQuickFilter = (row: QuickFilterRow): QuickFilter => ({
  name: row.name,
  href: buildQuickFilterHref(row.date_from, row.date_to),
});
