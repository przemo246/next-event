import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";
import { EVENT_CATEGORIES, subcategoriesFor } from "@/shared/data/event-categories";

import { buildSearchHref } from "../helpers/url";
import type { EventFilters } from "../helpers/filters";

type CategoryFilterProps = {
  filters: EventFilters;
};

export const CategoryFilter = ({ filters }: CategoryFilterProps) => {
  const subcategories = filters.category ? subcategoriesFor(filters.category) : undefined;

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

        {EVENT_CATEGORIES.map((category) => {
          const isActive = filters.category === category.name;

          return (
            <Button
              key={category.name}
              href={buildSearchHref(
                filters,
                isActive
                  ? { category: "", subcategory: "" }
                  : { category: category.name, subcategory: "" },
              )}
              variant={isActive ? "primary" : "secondary"}
            >
              {category.name}
            </Button>
          );
        })}
      </div>

      {subcategories && (
        <div className="flex flex-wrap items-center gap-2">
          <Text.Eyebrow className="mr-1.5 text-xs">Gatunek:</Text.Eyebrow>

          {subcategories.map((subcategory) => {
            const isActive = filters.subcategory === subcategory;

            return (
              <Button
                key={subcategory}
                href={buildSearchHref(filters, {
                  subcategory: isActive ? "" : subcategory,
                })}
                variant={isActive ? "primary" : "secondary"}
              >
                {subcategory}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};
