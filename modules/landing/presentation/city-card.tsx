import Link from "next/link";

import type { PopularCity } from "./types";
import { formatEventCount } from "./utils";

type CityCardProps = {
  city: PopularCity;
};

export const CityCard = ({ city }: CityCardProps) => {
  return (
    <Link
      href="#"
      className={
        city.featured
          ? "flex min-h-45 flex-col justify-end bg-accent px-5.5 py-5 text-accent-foreground transition-colors hover:bg-foreground"
          : "flex min-h-45 flex-col justify-end border border-border bg-canvas-raised px-5.5 py-5 transition-colors hover:bg-accent hover:text-accent-foreground"
      }
    >
      <span className="font-display text-[34px] font-extrabold tracking-tight">
        {city.name}
      </span>
      <span className="mt-1 font-mono text-[13px]">
        {formatEventCount(city.eventCount)}
      </span>
    </Link>
  );
};
