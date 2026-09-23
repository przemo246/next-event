import type { ComponentProps, ElementType, JSX } from "react";

import { cn } from "@/libs/cn";

/* =============================================================================
 * Factory
 * ============================================================================= */

type TextTag = keyof JSX.IntrinsicElements;

const createText = <T extends TextTag>(tag: T, base: string, displayName: string) => {
  const Tag = tag as ElementType;

  const Component = ({ className, ...props }: ComponentProps<T>) => (
    <Tag className={cn(base, className)} {...props} />
  );

  Component.displayName = `Text.${displayName}`;

  return Component;
};

/* =============================================================================
 * Variants
 * ============================================================================= */

const H1 = createText(
  "h1",
  "font-display text-4xl leading-tight font-extrabold tracking-tight",
  "H1",
);

const H2 = createText("h2", "font-display text-4xl font-extrabold tracking-tight", "H2");

const H3 = createText(
  "h3",
  "font-display text-2xl leading-[1.1] font-bold tracking-tight",
  "H3",
);

const Lead = createText("p", "text-[15px] leading-relaxed text-foreground-secondary", "Lead");

const Small = createText("p", "text-sm text-foreground-muted", "Small");

const Caption = createText("p", "text-xs leading-relaxed text-foreground-faint", "Caption");

const Eyebrow = createText(
  "span",
  "font-mono text-[11px] tracking-widest text-foreground-muted uppercase",
  "Eyebrow",
);

const Mono = createText("span", "font-mono text-[13px]", "Mono");

const Accent = createText("span", "text-accent", "Accent");

const Strong = createText("strong", "font-bold text-foreground", "Strong");

const ErrorBase = createText("p", "text-sm text-danger", "Error");

const Error = ({ role = "alert", ...props }: ComponentProps<"p">) => (
  <ErrorBase role={role} {...props} />
);

Error.displayName = "Text.Error";

/* =============================================================================
 * Text
 * ============================================================================= */

export const Text = {
  H1,
  H2,
  H3,
  Lead,
  Small,
  Caption,
  Eyebrow,
  Mono,
  Accent,
  Strong,
  Error,
};
