"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";

import { cn } from "@/libs/cn";

/* =============================================================================
 * Public Props
 * ============================================================================= */

export type ButtonVariant = "primary" | "secondary" | "link" | "link-accent";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  className?: string;
};

export type ButtonProps = ButtonBaseProps &
  (
    | (Omit<AriaButtonProps, "className"> & { href?: undefined })
    | Omit<ComponentProps<typeof Link>, "className">
  );

/* =============================================================================
 * Variants
 * ============================================================================= */

export const buttonVariants = (
  variant: ButtonVariant = "primary",
  className?: string,
) => {
  return cn(
    "inline-flex cursor-pointer items-center justify-center",
    "transition-colors duration-150",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary" &&
      "bg-accent px-5 py-3.5 font-display text-sm font-bold text-accent-foreground hover:bg-foreground",
    variant === "secondary" &&
      "border border-border-strong px-4 py-2 text-sm text-foreground hover:border-accent hover:text-accent",
    variant === "link" &&
      "text-sm font-bold text-foreground-secondary underline decoration-border-strong underline-offset-4 hover:text-accent disabled:hover:text-foreground-secondary",
    variant === "link-accent" &&
      "font-mono text-[13px] tracking-wide text-accent uppercase hover:text-foreground disabled:hover:text-accent",
    className,
  );
};

/* =============================================================================
 * Button
 * ============================================================================= */

export const Button = ({ variant = "primary", className, ...props }: ButtonProps) => {
  if (props.href) {
    return (
      <Link
        className={buttonVariants(variant, className)}
        {...(props as Omit<ComponentProps<typeof Link>, "className">)}
      />
    );
  }

  return (
    <AriaButton
      className={buttonVariants(variant, className)}
      {...(props as Omit<AriaButtonProps, "className">)}
    />
  );
};
