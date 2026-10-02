export type EventCategory = {
  name: string;
  subcategories?: readonly string[];
};

export const EVENT_CATEGORIES: readonly EventCategory[] = [
  {
    name: "Koncerty",
    subcategories: [
      "Pop",
      "Rock",
      "Hip-Hop/Rap",
      "Elektronika",
      "Jazz",
      "Muzyka taneczna",
      "Muzyka klasyczna",
      "Folk",
      "Metal",
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

export const subcategoriesFor = (
  category: string,
): readonly string[] | undefined =>
  EVENT_CATEGORIES.find((candidate) => candidate.name === category)
    ?.subcategories;
