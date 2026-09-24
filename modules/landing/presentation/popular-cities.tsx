import { Button } from "@/libs/ui/button";
import { Text } from "@/libs/ui/text";

import { CityCard } from "./city-card";
import { POPULAR_CITIES, POPULAR_CITIES_TOTAL } from "./mocks";

export const PopularCities = () => {
  return (
    <section>
      <div className="page-container px-6 py-10 sm:px-10">
        <div className="mb-5 flex items-baseline justify-between">
          <Text.H2>Popularne miasta</Text.H2>
          <Button href="#" variant="link-accent">
            Wszystkie {POPULAR_CITIES_TOTAL} →
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_CITIES.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
};
