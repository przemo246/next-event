import { createClient } from "@/libs/supabase/server";
import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";

import { toFeaturedEvent } from "../helpers/mapper";
import { fetchFeaturedEvents } from "../helpers/query";
import { EventCard } from "./event-card";

export const FeaturedEvents = async () => {
  const supabase = await createClient();
  const { events, total } = await fetchFeaturedEvents(supabase);
  const featuredEvents = events.map(toFeaturedEvent);

  return (
    <section className="border-b border-border">
      <div className="page-container px-6 sm:px-10">
        <div className="flex items-baseline justify-between py-5">
          <Text.H2>Polecane wydarzenia</Text.H2>
          <Button href="#" variant="link-accent">
            Wszystkie {total} →
          </Button>
        </div>

        {featuredEvents.length === 0 ? (
          <Text.Small className="block border-t border-border bg-canvas-raised px-6 py-16 text-center text-foreground-secondary">
            Brak polecanych wydarzeń.
          </Text.Small>
        ) : (
          <div className="grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
