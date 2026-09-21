import { DEFAULT_CITY } from "./mocks";

export const SearchPanel = () => {
  return (
    <form className="grid max-w-240 grid-cols-1 gap-px border border-border-strong bg-border sm:grid-cols-[1.5fr_1fr_1fr_auto]">
      <label className="flex flex-col gap-1.5 bg-canvas-raised px-5 py-4">
        <span className="font-mono text-[11px] tracking-widest text-foreground-muted uppercase">
          Szukaj
        </span>
        <input
          type="text"
          name="query"
          placeholder="Artysta, klub, tytuł…"
          className="bg-transparent text-[17px] text-foreground placeholder:text-foreground outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 bg-canvas-raised px-5 py-4">
        <span className="font-mono text-[11px] tracking-widest text-foreground-muted uppercase">
          Miasto
        </span>
        <input
          type="text"
          name="city"
          defaultValue={DEFAULT_CITY}
          className="bg-transparent text-[17px] text-foreground outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 bg-canvas-raised px-5 py-4">
        <span className="font-mono text-[11px] tracking-widest text-foreground-muted uppercase">
          Kiedy
        </span>
        <select
          name="when"
          defaultValue="Ten weekend"
          className="bg-transparent text-[17px] text-foreground outline-none"
        >
          <option>Ten weekend</option>
          <option>Dziś wieczorem</option>
          <option>Ten tydzień</option>
          <option>Wybierz datę</option>
        </select>
      </label>

      <button
        type="submit"
        className="cursor-pointer bg-accent px-9.5 font-display text-[17px] font-bold text-accent-foreground transition-colors hover:bg-foreground"
      >
        Szukaj
      </button>
    </form>
  );
};
