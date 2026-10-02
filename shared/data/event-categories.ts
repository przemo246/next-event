// The taxonomy is not final yet (see project notes), so it lives here as a
// plain constant rather than a database table — changing it is a one-line
// edit, not a migration. Mirrors how `POLISH_CITIES` backs the `city` field.
export type EventCategory = {
  name: string;
  subcategories?: readonly string[];
};

export const EVENT_CATEGORIES: readonly EventCategory[] = [
  {
    name: "Koncerty",
    subcategories: [
      "Rock",
      "Pop",
      "Hip-Hop/Rap",
      "Elektronika",
      "Jazz",
      "Disco Polo",
      "Inne",
    ],
  },
  { name: "Teatr" },
  { name: "Kino" },
  { name: "Kluby" },
  { name: "Festiwale" },
  { name: "Sport" },
  { name: "Inne" },
];

export const EVENT_CATEGORY_NAMES: readonly string[] = EVENT_CATEGORIES.map(
  (category) => category.name,
);

export const subcategoriesFor = (category: string): readonly string[] | undefined =>
  EVENT_CATEGORIES.find((candidate) => candidate.name === category)?.subcategories;
