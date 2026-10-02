export type PopularCity = {
  id: string;
  name: string;
  eventCount: number;
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
