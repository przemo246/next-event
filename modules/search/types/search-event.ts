export type SearchEvent = {
  id: number;
  name: string;
  city: string;
  street: string;
  startsAt: string;
  endsAt: string | null;
  imagePath: string | null;
  link: string | null;
  category: string;
  subcategory: string | null;
};
