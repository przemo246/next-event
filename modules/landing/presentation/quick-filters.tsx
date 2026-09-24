import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";

import { QUICK_FILTERS } from "./mocks";

export const QuickFilters = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Text.Eyebrow className="mr-1.5 text-xs">Szybko:</Text.Eyebrow>
      {QUICK_FILTERS.map((filter) => (
        <Button key={filter.label} href={filter.href} variant="secondary">
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
