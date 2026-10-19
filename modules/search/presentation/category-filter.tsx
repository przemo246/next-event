import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";
import { findCategoryBySlug } from "@/shared/modules/event-taxonomy/helpers/selection";
import type { EventCategory } from "@/shared/modules/event-taxonomy/types/event-category";

import { buildSearchHref } from "../helpers/url";
import type { EventFilters } from "../helpers/filters";

type CategoryFilterProps = {
  filters: EventFilters;
  categories: readonly EventCategory[];
};

export const CategoryFilter = ({ filters, categories }: CategoryFilterProps) => {
  const category = findCategoryBySlug(categories, filters.category);
  const subcategories = category?.subcategories ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Text.Eyebrow className="mr-1.5 text-xs">Kategoria:</Text.Eyebrow>

        <Button
          href={buildSearchHref(filters, { category: "", subcategory: "" })}
          variant={filters.category ? "secondary" : "primary"}
        >
          Wszystkie
        </Button>

        {categories.map((candidate) => {
          const isActive = filters.category === candidate.slug;

          return (
            <Button
              key={candidate.slug}
              href={buildSearchHref(
                filters,
                isActive
                  ? { category: "", subcategory: "" }
                  : { category: candidate.slug, subcategory: "" },
              )}
              variant={isActive ? "primary" : "secondary"}
            >
              {candidate.name}
            </Button>
          );
        })}
      </div>

      {subcategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Text.Eyebrow className="mr-1.5 text-xs">Gatunek:</Text.Eyebrow>

          {subcategories.map((subcategory) => {
            const isActive = filters.subcategory === subcategory.slug;

            return (
              <Button
                key={subcategory.slug}
                href={buildSearchHref(filters, {
                  subcategory: isActive ? "" : subcategory.slug,
                })}
                variant={isActive ? "primary" : "secondary"}
              >
                {subcategory.name}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};
