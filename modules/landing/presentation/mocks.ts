import type {
  FeaturedEvent,
  FooterLinkGroup,
  PopularCity,
  QuickFilter,
} from "./types";

export const HERO_SUBTITLE =
  "Koncerty, teatr, kino, kluby, festiwale i sport — 14 300 wydarzeń w 86 miastach. Szukaj po dacie, mieście i kategorii.";

export const DEFAULT_CITY = "Warszawa";

export const QUICK_FILTERS: QuickFilter[] = [
  { label: "Dziś wieczorem", href: "#" },
  { label: "Koncerty", href: "#" },
  { label: "Teatr", href: "#" },
  { label: "Kluby", href: "#" },
  { label: "Festiwale", href: "#" },
  { label: "Kino", href: "#" },
  { label: "Sport", href: "#" },
];

export const FEATURED_EVENTS: FeaturedEvent[] = [
  {
    id: "hania-rani",
    category: "Koncert",
    date: "pt 25.09",
    title: "Hania Rani",
    time: "20:00",
    venue: "Filharmonia",
    city: "Warszawa",
    priceFrom: "120 zł",
  },
  {
    id: "wesele",
    category: "Teatr",
    date: "sob 26.09",
    title: "Wesele",
    time: "19:00",
    venue: "Teatr Stary",
    city: "Kraków",
    priceFrom: "75 zł",
  },
  {
    id: "smolna-noc",
    category: "Klub",
    date: "sob 26.09",
    title: "Smolna: Noc",
    time: "23:00",
    venue: "Smolna",
    city: "Warszawa",
    priceFrom: "45 zł",
  },
  {
    id: "lech-legia",
    category: "Sport",
    date: "nd 27.09",
    title: "Lech — Legia",
    time: "17:30",
    venue: "Enea Stadion",
    city: "Poznań",
    priceFrom: "60 zł",
  },
];

export const FEATURED_EVENTS_TOTAL = 212;

export const POPULAR_CITIES: PopularCity[] = [
  { id: "warszawa", name: "Warszawa", eventCount: 4820 },
  { id: "wroclaw", name: "Wrocław", eventCount: 2140 },
  { id: "krakow", name: "Kraków", eventCount: 3010 },
  { id: "poznan", name: "Poznań", eventCount: 1560 },
];

export const POPULAR_CITIES_TOTAL = 86;

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Wydarzenia",
    links: [
      { label: "Koncerty", href: "#" },
      { label: "Teatr", href: "#" },
      { label: "Kluby", href: "#" },
      { label: "Festiwale", href: "#" },
    ],
  },
  {
    title: "Miasta",
    links: [
      { label: "Warszawa", href: "#" },
      { label: "Kraków", href: "#" },
      { label: "Wrocław", href: "#" },
      { label: "Poznań", href: "#" },
    ],
  },
  {
    title: "Afisz",
    links: [
      { label: "Dla organizatorów", href: "#" },
      { label: "Kontakt", href: "#" },
      { label: "Regulamin", href: "#" },
      { label: "Prywatność", href: "#" },
    ],
  },
];
