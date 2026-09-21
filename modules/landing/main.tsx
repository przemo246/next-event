import { FeaturedEvents } from "./presentation/featured-events";
import { Footer } from "./presentation/footer";
import { Header } from "./presentation/header";
import { Hero } from "./presentation/hero";
import { PopularCities } from "./presentation/popular-cities";

export const Main = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas font-body text-foreground">
      <Header />
      <Hero />
      <FeaturedEvents />
      <PopularCities />
      <Footer />
    </div>
  );
};
