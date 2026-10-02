"use client";

import { useState, useTransition } from "react";

import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";

import type { EventFilters } from "../helpers/filters";
import type { SearchEvent } from "../types/search-event";
import { EventCard } from "./event-card";

type EventsResponse = {
  events: SearchEvent[];
  hasMore: boolean;
};

const buildApiQuery = (filters: EventFilters, offset: number) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }

  params.set("offset", String(offset));

  return params.toString();
};

type ResultsListProps = {
  filters: EventFilters;
  initialEvents: SearchEvent[];
  initialHasMore: boolean;
};

export const ResultsList = ({
  filters,
  initialEvents,
  initialHasMore,
}: ResultsListProps) => {
  const [events, setEvents] = useState(initialEvents);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/events?${buildApiQuery(filters, events.length)}`,
        );

        if (!response.ok) throw new Error("request-failed");

        const data: EventsResponse = await response.json();

        setEvents((current) => [...current, ...data.events]);
        setHasMore(data.hasMore);
      } catch {
        setError("Nie udało się wczytać kolejnych wydarzeń. Spróbuj ponownie.");
      }
    });
  };

  if (events.length === 0) {
    return (
      <div className="border border-border bg-canvas-raised px-6 py-16 text-center">
        <Text.H3 className="mb-2">Nie znaleziono wydarzeń</Text.H3>
        <Text.Small className="mb-5">
          Nie znaleziono wydarzeń spełniających podane kryteria. Spróbuj zmienić
          filtry.
        </Text.Small>
        <Button href="/search" variant="link-accent">
          Wyczyść filtry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {error && <Text.Error>{error}</Text.Error>}

      {hasMore && (
        <Button
          type="button"
          variant="secondary"
          className="self-center"
          isDisabled={isPending}
          onPress={loadMore}
        >
          {isPending ? "Wczytywanie…" : "Pokaż więcej"}
        </Button>
      )}
    </div>
  );
};
