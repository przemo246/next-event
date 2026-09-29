"use client";

import { useState } from "react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
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
  getRange: () => DateRange | null;
};

const ANY_PRESET_ID = "any";
const CUSTOM_PRESET_ID = "custom";

const timeZone = getLocalTimeZone();

const getSingleDayRange = (date: CalendarDate): DateRange => ({
  start: date,
  end: date,
});

const startOfWeek = (date: CalendarDate) => {
  const isoWeekday = date.toDate(timeZone).getDay() || 7;

  return date.subtract({ days: isoWeekday - 1 });
};

const endOfWeek = (date: CalendarDate) => startOfWeek(date).add({ days: 6 });

const getTodayRange = (): DateRange => getSingleDayRange(today(timeZone));

const getTomorrowRange = (): DateRange =>
  getSingleDayRange(today(timeZone).add({ days: 1 }));

const getWeekendRange = (): DateRange => {
  const now = today(timeZone);
  const weekday = now.toDate(timeZone).getDay();

  if (weekday === 0) {
    return { start: now.subtract({ days: 1 }), end: now };
  }

  const start = now.add({ days: (6 - weekday + 7) % 7 });

  return { start, end: start.add({ days: 1 }) };
};

const getWeekRange = (): DateRange => {
  const now = today(timeZone);

  return { start: now, end: endOfWeek(now) };
};

const getNextWeekRange = (): DateRange => {
  const start = startOfWeek(today(timeZone)).add({ days: 7 });

  return { start, end: endOfWeek(start) };
};

const getMonthRange = (): DateRange => {
  const start = today(timeZone).set({ day: 1 });

  return { start, end: start.add({ months: 1 }).subtract({ days: 1 }) };
};

const PRESETS: Preset[] = [
  { id: ANY_PRESET_ID, label: "Dowolna data", getRange: () => null },
  { id: "today", label: "Dzisiaj", getRange: getTodayRange },
  { id: "tomorrow", label: "Jutro", getRange: getTomorrowRange },
  { id: "weekend", label: "W ten weekend", getRange: getWeekendRange },
  { id: "week", label: "W tym tygodniu", getRange: getWeekRange },
  {
    id: "next-week",
    label: "W przyszłym tygodniu",
    getRange: getNextWeekRange,
  },
  { id: "month", label: "W tym miesiącu", getRange: getMonthRange },
];

const DEFAULT_PRESET = PRESETS[0];

/* =============================================================================
 * Formatting
 * ============================================================================= */

const rangeFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "short",
});

const formatRange = (range: DateRange) => {
  const start = rangeFormatter.format(range.start.toDate(timeZone));

  if (range.start.compare(range.end) === 0) return start;

  return `${start} – ${rangeFormatter.format(range.end.toDate(timeZone))}`;
};

/* =============================================================================
 * RadioIndicator
 * ============================================================================= */

type RadioIndicatorProps = {
  isSelected: boolean;
};

const RadioIndicator = ({ isSelected }: RadioIndicatorProps) => (
  <span
    aria-hidden
    className="flex size-4 shrink-0 items-center justify-center rounded-full border border-foreground-secondary"
  >
    {isSelected && <span className="size-1.5 rounded-full bg-foreground" />}
  </span>
);

/* =============================================================================
 * DateRangeField
 * ============================================================================= */

type Selection = {
  id: string;
  label: string;
  range: DateRange | null;
};

export const DateRangeField = () => {
  const [view, setView] = useState<"presets" | "calendar">("presets");
  const [draftRange, setDraftRange] = useState<DateRange | null>(null);
  const [selected, setSelected] = useState<Selection>({
    id: DEFAULT_PRESET.id,
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
                {PRESETS.map((preset) => {
                  const isSelected = selected.id === preset.id;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelected({
                          id: preset.id,
                          label: preset.label,
                          range: preset.getRange(),
                        });
                        close();
                      }}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left text-sm  text-foreground outline-none hover:bg-canvas-inset hover:text-accent",
                        preset.id === ANY_PRESET_ID && "border-b border-border",
                      )}
                    >
                      {preset.label}
                      <RadioIndicator isSelected={isSelected} />
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setView("calendar")}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-foreground outline-none hover:bg-canvas-inset hover:text-accent"
                >
                  Niestandardowy zakres dat
                  <ChevronRight className="size-4 text-foreground-muted" />
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
                  <Text.Small className="text-foreground">
                    Niestandardowy zakres dat
                  </Text.Small>
                </div>

                <I18nProvider locale="pl-PL">
                  <Calendar
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

                    setSelected({
                      id: CUSTOM_PRESET_ID,
                      label: formatRange(draftRange),
                      range: draftRange,
                    });
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

      <input
        type="hidden"
        name="dateFrom"
        value={selected.range?.start.toString() ?? ""}
      />
      <input
        type="hidden"
        name="dateTo"
        value={selected.range?.end.toString() ?? ""}
      />
    </AriaDialogTrigger>
  );
};
