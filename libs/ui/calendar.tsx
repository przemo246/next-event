"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button as AriaButton,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  Heading as AriaHeading,
  RangeCalendar as AriaRangeCalendar,
  type DateValue,
  type RangeCalendarProps as AriaRangeCalendarProps,
} from "react-aria-components";

import { cn } from "@/libs/cn";

/* =============================================================================
 * Helpers
 * ============================================================================= */

const WEEKDAY_LABELS: Record<string, string> = {
  pon: "Pon",
  wt: "Wt",
  śr: "Śr",
  czw: "Czw",
  pt: "Pt",
  sob: "Sob",
  niedz: "Nie",
};

const formatWeekday = (day: string) => {
  const key = day.replace(/\.$/, "").toLowerCase();

  return WEEKDAY_LABELS[key] ?? day;
};

/* =============================================================================
 * Range
 * ============================================================================= */

export type CalendarRangeProps<T extends DateValue> = AriaRangeCalendarProps<T>;

const Range = <T extends DateValue>({ className, ...props }: CalendarRangeProps<T>) => (
  <AriaRangeCalendar className={cn("w-full", className)} {...props}>
    <header className="mb-4 flex items-center justify-between">
      <AriaButton
        slot="previous"
        className="flex size-8 cursor-pointer items-center justify-center text-foreground-secondary outline-none hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </AriaButton>
      <AriaHeading className="font-display text-[15px] font-bold text-foreground capitalize" />
      <AriaButton
        slot="next"
        className="flex size-8 cursor-pointer items-center justify-center text-foreground-secondary outline-none hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </AriaButton>
    </header>

    <AriaCalendarGrid weekdayStyle="short" className="w-full border-collapse">
      <AriaCalendarGridHeader>
        {(day) => (
          <AriaCalendarHeaderCell className="pb-2 text-center font-mono text-[11px] tracking-wide text-foreground-muted uppercase">
            {formatWeekday(day)}
          </AriaCalendarHeaderCell>
        )}
      </AriaCalendarGridHeader>
      <AriaCalendarGridBody>
        {(date) => (
          <AriaCalendarCell
            date={date}
            className={({
              isSelected,
              isSelectionStart,
              isSelectionEnd,
              isOutsideMonth,
              isDisabled,
              isUnavailable,
              isToday,
              isFocusVisible,
            }) =>
              cn(
                "flex size-9 cursor-pointer items-center justify-center text-sm text-foreground outline-none",
                isOutsideMonth && "text-foreground-faint",
                isToday && !isSelected && "font-bold text-accent",
                isSelected && "bg-accent/15",
                (isSelectionStart || isSelectionEnd) &&
                  "bg-accent font-bold text-accent-foreground",
                isUnavailable && "text-foreground-faint line-through",
                isDisabled && "cursor-not-allowed opacity-40",
                isFocusVisible && "ring-2 ring-inset ring-ring",
              )
            }
          />
        )}
      </AriaCalendarGridBody>
    </AriaCalendarGrid>
  </AriaRangeCalendar>
);

Range.displayName = "Calendar.Range";

/* =============================================================================
 * Calendar
 * ============================================================================= */

export const Calendar = {
  Range,
};
