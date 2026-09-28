"use client";

import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type MenuTriggerProps as AriaMenuTriggerProps,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";

import { cn } from "@/libs/cn";

/* =============================================================================
 * Root
 * ============================================================================= */

export type DropdownProps = AriaMenuTriggerProps;

const Root = (props: DropdownProps) => <AriaMenuTrigger {...props} />;

Root.displayName = "Dropdown.Root";

/* =============================================================================
 * Menu
 * ============================================================================= */

export type DropdownMenuProps<T extends object> = AriaMenuProps<T> &
  Pick<AriaPopoverProps, "placement" | "offset"> & {
    popoverClassName?: string;
  };

const Menu = <T extends object>({
  className,
  popoverClassName,
  placement = "bottom end",
  offset = 8,
  ...props
}: DropdownMenuProps<T>) => (
  <AriaPopover
    placement={placement}
    offset={offset}
    className={cn(
      "min-w-44 origin-top-right border border-border-strong bg-canvas-raised py-1 opacity-100 shadow-lg outline-none",
      "scale-100 transition-[opacity,transform] duration-150",
      "data-entering:scale-95 data-entering:opacity-0",
      "data-exiting:scale-95 data-exiting:opacity-0",
      popoverClassName,
    )}
  >
    <AriaMenu className={cn("outline-none", className)} {...props} />
  </AriaPopover>
);

Menu.displayName = "Dropdown.Menu";

/* =============================================================================
 * Item
 * ============================================================================= */

export type DropdownItemProps = AriaMenuItemProps;

const Item = ({ className, ...props }: DropdownItemProps) => (
  <AriaMenuItem
    className={cn(
      "flex cursor-pointer items-center px-4 py-2.5 text-sm text-foreground outline-none select-none font-body",
      "data-focused:bg-canvas-inset data-focused:text-accent",
      "data-disabled:cursor-not-allowed data-disabled:opacity-60",
      className,
    )}
    {...props}
  />
);

Item.displayName = "Dropdown.Item";

/* =============================================================================
 * Dropdown
 * ============================================================================= */

export const Dropdown = {
  Root,
  Menu,
  Item,
};
