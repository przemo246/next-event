import Link from "next/link";

import { Text } from "@/libs/ui/text";

import { QUICK_FILTERS } from "./mocks";

export const QuickFilters = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Text.Eyebrow className="mr-1.5 text-xs">Szybko:</Text.Eyebrow>
      {QUICK_FILTERS.map((filter) => (
        <Link
          key={filter.label}
          href={filter.href}
          className="border border-border-strong px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
};
