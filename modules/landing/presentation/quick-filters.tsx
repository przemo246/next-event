import { createClient } from "@/libs/supabase/server";
import { Button } from "@/libs/ui/button";

import { toQuickFilter } from "../helpers/mapper";
import { fetchOccasionFilters } from "../helpers/query";

export const QuickFilters = async () => {
  const supabase = await createClient();
  const occasionFilters = await fetchOccasionFilters(supabase);
  const filters = occasionFilters.map(toQuickFilter);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Button key={filter.label} href={filter.href} variant="secondary">
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
