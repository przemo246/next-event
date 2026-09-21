import Link from "next/link";

import { Container } from "./container";
import { EventCard } from "./event-card";
import { FEATURED_EVENTS, FEATURED_EVENTS_TOTAL } from "./mocks";

export const FeaturedEvents = () => {
  return (
    <section className="border-b border-border">
      <Container className="px-6 sm:px-10">
        <div className="flex items-baseline justify-between py-5">
          <h2 className="font-display text-4xl font-extrabold tracking-tight">
            Polecane wydarzenia
          </h2>
          <Link
            href="#"
            className="font-mono text-[13px] tracking-wide text-accent uppercase"
          >
            Wszystkie {FEATURED_EVENTS_TOTAL} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Container>
    </section>
  );
};
