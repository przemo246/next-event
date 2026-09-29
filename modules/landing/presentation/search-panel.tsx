import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";
import { CityField } from "@/shared/modules/city-field/presentation/city-field";

import { DateRangeField } from "./date-range-field";

export const SearchPanel = () => {
  return (
    <form className="grid max-w-240 grid-cols-1 gap-px border border-border-strong bg-border sm:grid-cols-[1.5fr_1fr_1fr_auto]">
      <label className="flex flex-col gap-1.5 bg-canvas-raised px-5 py-4">
        <Text.Eyebrow>Szukaj</Text.Eyebrow>
        <input
          type="text"
          name="query"
          placeholder="Artysta, klub, tytuł…"
          className="bg-transparent text-[17px] text-foreground placeholder:text-foreground-muted outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 bg-canvas-raised px-5 py-4">
        <Text.Eyebrow>Miasto</Text.Eyebrow>
        <CityField />
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
