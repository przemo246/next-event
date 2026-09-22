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

export type ButtonVariant = "primary";

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
