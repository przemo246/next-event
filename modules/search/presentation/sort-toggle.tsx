import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@/libs/ui/button";

import { buildSearchHref } from "../helpers/url";
import type { EventFilters } from "../helpers/filters";

type SortToggleProps = {
  filters: EventFilters;
};

export const SortToggle = ({ filters }: SortToggleProps) => {
  const nextSort = filters.sort === "asc" ? "desc" : "asc";

  return (
    <Button href={buildSearchHref(filters, { sort: nextSort })} variant="secondary">
      {filters.sort === "asc" ? (
        <>
          <ArrowUp className="mr-2 size-4" />
          Najbliższe najpierw
        </>
      ) : (
        <>
          <ArrowDown className="mr-2 size-4" />
          Najdalsze najpierw
        </>
      )}
    </Button>
  );
};
