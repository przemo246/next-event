import Link from "next/link";

import { Text } from "@/libs/ui/text";

import { FOOTER_LINK_GROUPS } from "./mocks";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-canvas-inset">
      <div className="page-container grid grid-cols-1 gap-10 px-6 pt-11 pb-9 sm:grid-cols-[1.4fr_1fr_1fr_1fr] sm:px-10">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex h-6.5 w-6.5 items-center justify-center bg-accent font-display text-[17px] font-extrabold text-accent-foreground">
              A
            </span>
            <span className="font-display text-[22px] font-extrabold tracking-tight">
              Afisz
            </span>
          </div>
          <Text.Small className="max-w-[34ch] leading-relaxed">
            Wyszukiwarka wydarzeń w Polsce. 14 300 wydarzeń, 86 miast, jedna
            lista.
          </Text.Small>
        </div>

        {FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-2.25 text-sm">
            <Text.Eyebrow className="mb-1">{group.title}</Text.Eyebrow>
            {group.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="page-container flex items-center justify-between px-6 py-4 font-mono text-xs text-foreground-muted sm:px-10">
          <span>© {year} Afisz</span>
          <span>Warszawa, Polska</span>
        </div>
      </div>
    </footer>
  );
};
