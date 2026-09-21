export type FeaturedEvent = {
  id: string;
  category: string;
  date: string;
  title: string;
  time: string;
  venue: string;
  city: string;
  priceFrom: string;
};

export type PopularCity = {
  id: string;
  name: string;
  eventCount: number;
  featured?: boolean;
};

export type QuickFilter = {
  label: string;
  href: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  title: string;
  links: FooterLink[];
};
