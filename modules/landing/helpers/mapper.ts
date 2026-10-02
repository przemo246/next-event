import type { FeaturedEventRow } from "./query";
import type { FeaturedEvent } from "../types/featured-event";

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
