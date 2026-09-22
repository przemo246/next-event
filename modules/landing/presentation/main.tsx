import { FeaturedEvents } from "./featured-events";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { PopularCities } from "./popular-cities";

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
