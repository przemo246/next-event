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
        <p className="mb-2 font-mono text-[11px] tracking-widest text-accent uppercase">
          {event.category} · {event.date}
        </p>
        <h3 className="mb-2 font-display text-2xl leading-[1.1] font-bold tracking-tight">
          {event.title}
        </h3>
        <p className="text-sm text-foreground-secondary">
          {event.time} · {event.venue}, {event.city}
        </p>
        <p className="mt-2.5 font-mono text-[13px] text-foreground">
          od {event.priceFrom}
        </p>
      </div>
    </article>
  );
};
