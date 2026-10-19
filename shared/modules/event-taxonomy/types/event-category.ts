export type EventSubcategory = {
  id: number;
  name: string;
  slug: string;
};

export type EventCategory = {
  id: number;
  name: string;
  slug: string;
  subcategories: EventSubcategory[];
};
