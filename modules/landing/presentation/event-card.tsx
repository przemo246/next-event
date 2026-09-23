import { Text } from "@/libs/ui/text";

import type { FeaturedEvent } from "./types";

type EventCardProps = {
  event: FeaturedEvent;
};

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <article className="group bg-canvas transition-colors hover:bg-canvas-raised">
      <div className="flex aspect-3/4 items-end bg-[repeating-linear-gradient(135deg,var(--color-canvas-raised)_0px_9px,var(--color-canvas)_9px_18px)] p-3 font-mono text-[10px] tracking-widest text-foreground-faint uppercase">
        plakat 3:4
      </div>

      <div className="px-5 pt-4.5 pb-6">
        <Text.Eyebrow className="mb-2 block text-accent">
          {event.category} · {event.date}
        </Text.Eyebrow>
        <Text.H3 className="mb-2">{event.title}</Text.H3>
        <Text.Small className="text-foreground-secondary">
          {event.time} · {event.venue}, {event.city}
        </Text.Small>
        <Text.Mono className="mt-2.5 block text-foreground">
          od {event.priceFrom}
        </Text.Mono>
      </div>
    </article>
  );
};
