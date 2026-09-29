"use client";

import {
  ComboBox as AriaComboBox,
  Input as AriaInput,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
} from "react-aria-components";

import { cn } from "@/libs/cn";
import { POLISH_CITIES } from "@/shared/data/polish-cities";

type CityFieldProps = {
  name?: string;
  defaultValue?: string;
};

export const CityField = ({ name = "city", defaultValue }: CityFieldProps) => {
  return (
    <AriaComboBox
      aria-label="Miasto"
      name={name}
      defaultInputValue={defaultValue}
      defaultItems={POLISH_CITIES.map((city) => ({ id: city }))}
      menuTrigger="input"
      className="w-full"
    >
      <AriaInput
        placeholder="np. Warszawa"
        className="w-full bg-transparent text-[17px] text-foreground outline-none placeholder:text-foreground-muted"
      />

      <AriaPopover
        placement="bottom start"
        offset={8}
        className={cn(
          "max-h-72 w-64 origin-top overflow-y-auto border border-border-strong bg-canvas-raised opacity-100 shadow-lg outline-none",
          "scale-100 transition-[opacity,transform] duration-150",
          "data-entering:scale-95 data-entering:opacity-0",
          "data-exiting:scale-95 data-exiting:opacity-0",
        )}
      >
        <AriaListBox className="py-1 outline-none" renderEmptyState={() => (
          <p className="px-4 py-2.5 text-sm text-foreground-muted">Brak wyników</p>
        )}>
          {(item: { id: string }) => (
            <AriaListBoxItem
              id={item.id}
              textValue={item.id}
              className={cn(
                "cursor-pointer px-4 py-2.5 text-sm text-foreground outline-none select-none",
                "data-focused:bg-canvas-inset data-focused:text-accent",
              )}
            >
              {item.id}
            </AriaListBoxItem>
          )}
        </AriaListBox>
      </AriaPopover>
    </AriaComboBox>
  );
};
