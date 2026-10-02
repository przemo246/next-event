import { Text } from "@/libs/ui/text";

import type { SearchEvent } from "../types/search-event";

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
});

type EventCardProps = {
  event: SearchEvent;
};

export const EventCard = ({ event }: EventCardProps) => {
  const startsAt = new Date(event.startsAt);

  return (
    <article className="group bg-canvas transition-colors hover:bg-canvas-raised">
      <div className="flex aspect-3/4 items-end bg-[repeating-linear-gradient(135deg,var(--color-canvas-raised)_0px_9px,var(--color-canvas)_9px_18px)] p-3 font-mono text-[10px] tracking-widest text-foreground-faint uppercase">
        plakat 3:4
      </div>

      <div className="px-5 pt-4.5 pb-6">
        <Text.Eyebrow className="mb-2 block text-accent">
          {event.subcategory ?? event.category} ·{" "}
          {dateFormatter.format(startsAt)}
        </Text.Eyebrow>
        <Text.H3 className="mb-2">{event.name}</Text.H3>
        <Text.Small className="text-foreground-secondary">
          {timeFormatter.format(startsAt)} · {event.street}, {event.city}
        </Text.Small>
      </div>
    </article>
  );
};
