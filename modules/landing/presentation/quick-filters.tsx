import Link from "next/link";

import { QUICK_FILTERS } from "./mocks";

export const QuickFilters = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1.5 font-mono text-xs tracking-widest text-foreground-muted uppercase">
        Szybko:
      </span>
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
