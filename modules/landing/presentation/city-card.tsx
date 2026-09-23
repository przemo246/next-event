import Link from "next/link";

import { Text } from "@/libs/ui/text";

import type { PopularCity } from "./types";
import { formatEventCount } from "./utils";

type CityCardProps = {
  city: PopularCity;
};

export const CityCard = ({ city }: CityCardProps) => {
  return (
    <Link
      href="#"
      className="flex min-h-45 flex-col justify-end border border-border bg-canvas-raised px-5.5 py-5 transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <span className="font-display text-[34px] font-extrabold tracking-tight">
        {city.name}
      </span>
      <Text.Mono className="mt-1">
        {formatEventCount(city.eventCount)}
      </Text.Mono>
    </Link>
  );
};
