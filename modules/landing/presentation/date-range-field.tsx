"use client";

import { useState } from "react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { ArrowLeft, ChevronDown } from "lucide-react";
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  I18nProvider,
  Popover as AriaPopover,
  type RangeValue,
} from "react-aria-components";

import { cn } from "@/libs/cn";
import { Button } from "@/libs/ui/button";
import { Calendar } from "@/libs/ui/calendar";
import { Text } from "@/libs/ui/text";

/* =============================================================================
 * Presets
 * ============================================================================= */

type DateRange = RangeValue<CalendarDate>;

type Preset = {
  id: string;
  label: string;
  getRange: () => DateRange;
};

const timeZone = getLocalTimeZone();

const getTodayRange = (): DateRange => {
  const now = today(timeZone);

  return { start: now, end: now };
};

const getWeekendRange = (): DateRange => {
  const now = today(timeZone);
  const weekday = now.toDate(timeZone).getDay();

  if (weekday === 0) {
    const start = now.subtract({ days: 1 });

    return { start, end: now };
  }

  const start = now.add({ days: (6 - weekday + 7) % 7 });

  return { start, end: start.add({ days: 1 }) };
};

const getWeekRange = (): DateRange => {
  const now = today(timeZone);
  const isoWeekday = now.toDate(timeZone).getDay() || 7;

  return { start: now, end: now.add({ days: 7 - isoWeekday }) };
};

const PRESETS: Preset[] = [
  { id: "today", label: "Dziś", getRange: getTodayRange },
  { id: "weekend", label: "Ten weekend", getRange: getWeekendRange },
  { id: "week", label: "Ten tydzień", getRange: getWeekRange },
];

const DEFAULT_PRESET = PRESETS[1];

/* =============================================================================
 * Formatting
 * ============================================================================= */

const rangeFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short" });

const formatRange = (range: DateRange) => {
  const start = rangeFormatter.format(range.start.toDate(timeZone));

  if (range.start.compare(range.end) === 0) return start;

  return `${start} – ${rangeFormatter.format(range.end.toDate(timeZone))}`;
};

/* =============================================================================
 * DateRangeField
 * ============================================================================= */

type Selection = {
  label: string;
  range: DateRange;
};

export const DateRangeField = () => {
  const [view, setView] = useState<"presets" | "calendar">("presets");
  const [draftRange, setDraftRange] = useState<DateRange | null>(null);
  const [selected, setSelected] = useState<Selection>({
    label: DEFAULT_PRESET.label,
    range: DEFAULT_PRESET.getRange(),
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) return;

    setView("presets");
    setDraftRange(null);
  };

  return (
    <AriaDialogTrigger onOpenChange={handleOpenChange}>
      <Button
        variant="secondary"
        className="w-full justify-between border-0 bg-transparent p-0 text-left text-[17px] font-normal text-foreground normal-case hover:border-0 hover:text-accent"
      >
        {selected.label}
        <ChevronDown className="size-4 text-foreground-muted" />
      </Button>

      <AriaPopover
        placement="bottom start"
        offset={8}
        className={cn(
          "w-80 origin-top border border-border-strong bg-canvas-raised opacity-100 shadow-lg outline-none",
          "scale-100 transition-[opacity,transform] duration-150",
          "data-entering:scale-95 data-entering:opacity-0",
          "data-exiting:scale-95 data-exiting:opacity-0",
        )}
      >
        <AriaDialog className="outline-none">
          {({ close }) =>
            view === "presets" ? (
              <div className="py-1">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelected({ label: preset.label, range: preset.getRange() });
                      close();
                    }}
                    className="flex w-full cursor-pointer items-center px-4 py-2.5 text-left text-sm text-foreground outline-none hover:bg-canvas-inset hover:text-accent"
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setView("calendar")}
                  className="flex w-full cursor-pointer items-center border-t border-border px-4 py-2.5 text-left text-sm text-foreground outline-none hover:bg-canvas-inset hover:text-accent"
                >
                  Niestandardowy zakres dat
                </button>
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-4 flex items-center gap-3 border-b border-border pb-3">
                  <button
                    type="button"
                    aria-label="Wróć"
                    onClick={() => setView("presets")}
                    className="flex cursor-pointer items-center text-foreground-secondary outline-none hover:text-accent"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <Text.Small className="font-bold text-foreground">
                    Niestandardowy zakres dat
                  </Text.Small>
                </div>

                <I18nProvider locale="pl-PL">
                  <Calendar.Range
                    aria-label="Zakres dat"
                    value={draftRange}
                    onChange={setDraftRange}
                    minValue={today(timeZone)}
                  />
                </I18nProvider>

                <Button
                  type="button"
                  className="mt-4 w-full py-3"
                  isDisabled={!draftRange}
                  onPress={() => {
                    if (!draftRange) return;

                    setSelected({ label: formatRange(draftRange), range: draftRange });
                    close();
                  }}
                >
                  Zastosuj
                </Button>
              </div>
            )
          }
        </AriaDialog>
      </AriaPopover>

      <input type="hidden" name="dateFrom" value={selected.range.start.toString()} />
      <input type="hidden" name="dateTo" value={selected.range.end.toString()} />
    </AriaDialogTrigger>
  );
};
