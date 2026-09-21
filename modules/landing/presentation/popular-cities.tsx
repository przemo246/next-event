import Link from "next/link";

import { CityCard } from "./city-card";
import { Container } from "./container";
import { POPULAR_CITIES, POPULAR_CITIES_TOTAL } from "./mocks";

export const PopularCities = () => {
  return (
    <section>
      <Container className="px-6 py-10 sm:px-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-4xl font-extrabold tracking-tight">
            Popularne miasta
          </h2>
          <Link
            href="#"
            className="font-mono text-[13px] tracking-wide text-accent uppercase"
          >
            Wszystkie {POPULAR_CITIES_TOTAL} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_CITIES.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </Container>
    </section>
  );
};
