import { createClient } from "@/libs/supabase/server";
import { Button } from "@/libs/ui/button";

import { toQuickFilter } from "../helpers/mapper";
import { fetchQuickFilters } from "../helpers/query";

export const QuickFilters = async () => {
  const supabase = await createClient();
  const quickFilters = await fetchQuickFilters(supabase);
  const filters = quickFilters.map(toQuickFilter);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Button key={filter.name} href={filter.href} variant="secondary">
          {filter.name}
        </Button>
      ))}
    </div>
  );
};
