import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";

import { EventCard } from "./event-card";
import { FEATURED_EVENTS, FEATURED_EVENTS_TOTAL } from "./mocks";

export const FeaturedEvents = () => {
  return (
    <section className="border-b border-border">
      <div className="page-container px-6 sm:px-10">
        <div className="flex items-baseline justify-between py-5">
          <Text.H2>Polecane wydarzenia</Text.H2>
          <Button href="#" variant="link-accent">
            Wszystkie {FEATURED_EVENTS_TOTAL} →
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};
