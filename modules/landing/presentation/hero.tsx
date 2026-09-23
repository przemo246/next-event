import { HERO_SUBTITLE } from "./mocks";
import { QuickFilters } from "./quick-filters";
import { SearchPanel } from "./search-panel";

export const Hero = () => {
  return (
    <section className="border-b border-border">
      <div className="page-container px-6 py-16 sm:px-10 sm:py-20">
        <h1 className="mb-5 max-w-[11ch] font-display text-6xl leading-[0.98] font-extrabold tracking-tight sm:text-8xl">
          Co gra <span className="text-accent">dziś wieczorem</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-foreground-secondary sm:text-[19px]">
          {HERO_SUBTITLE}
        </p>

        <SearchPanel />

        <div className="mt-5">
          <QuickFilters />
        </div>
      </div>
    </section>
  );
};
