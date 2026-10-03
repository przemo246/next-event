import type { FooterLinkGroup } from "../types/footer";

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