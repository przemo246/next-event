import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";
import { CityField } from "@/shared/modules/city-field/presentation/city-field";
import { DateRangeField } from "@/shared/modules/date-range-field/presentation/date-range-field";

import type { EventFilters } from "../helpers/filters";

type SearchFormProps = {
  filters: EventFilters;
};

export const SearchForm = ({ filters }: SearchFormProps) => {
  return (
    <form
      action="/search"
      method="get"
      className="grid max-w-240 grid-cols-1 gap-px border border-border-strong bg-border sm:grid-cols-[1.5fr_1fr_1fr_auto]"
    >
      {/* Category/sort live outside this form (category buttons, sort toggle),
          so they travel along as hidden fields instead of being reset on submit. */}
      <input type="hidden" name="category" value={filters.category} />
      <input type="hidden" name="subcategory" value={filters.subcategory} />
      <input type="hidden" name="sort" value={filters.sort} />

      <label className="flex flex-col gap-1.5 bg-canvas-raised px-5 py-4">
        <Text.Eyebrow>Szukaj</Text.Eyebrow>
        <input
          type="text"
          name="query"
          defaultValue={filters.query}
          placeholder="Artysta, klub, tytuł…"
          className="bg-transparent text-[17px] text-foreground placeholder:text-foreground-muted outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 bg-canvas-raised px-5 py-4">
        <Text.Eyebrow>Miasto</Text.Eyebrow>
        <CityField defaultValue={filters.city} />
      </label>

      <label className="flex flex-col gap-1.5 bg-canvas-raised px-5 py-4">
        <Text.Eyebrow>Kiedy</Text.Eyebrow>
        <DateRangeField />
      </label>

      <Button type="submit" className="px-9.5 py-0 text-[17px]">
        Szukaj
      </Button>
    </form>
  );
};
