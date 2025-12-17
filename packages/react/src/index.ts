"use client";

import { useCallback, useMemo, useState } from "react";
import type { DateRange, DayCell } from "@mini-date/core";
import {
  applyRangeClick,
  buildMonthGrid,
  compareYMD,
  isBetweenYMD,
  isSameYMD,
} from "@mini-date/core";

type WeekStartsOn = 0 | 1;

type UseRangeCalendarParams = {
  value: DateRange;
  onChange: (next: DateRange) => void;
  weekStartsOn?: WeekStartsOn;
  min?: Date;
  max?: Date;
  isDisabled?: (d: Date) => boolean;
  initialMonth?: Date;
};

export function useRangeCalendar({
  value,
  onChange,
  weekStartsOn = 1,
  min,
  max,
  isDisabled,
  initialMonth,
}: UseRangeCalendarParams) {
  const base = initialMonth ?? value.start ?? new Date();
  const [viewYear, setViewYear] = useState(base.getFullYear());
  const [viewMonthIndex, setViewMonthIndex] = useState(base.getMonth());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const weeks = useMemo(
    () =>
      buildMonthGrid({
        year: viewYear,
        monthIndex: viewMonthIndex,
        weekStartsOn,
        min,
        max,
        isDisabled,
      }),
    [viewYear, viewMonthIndex, weekStartsOn, min, max, isDisabled],
  );

  const goPrevMonth = useCallback(() => {
    setHoverDate(null);
    setViewMonthIndex((month) => {
      if (month === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return month - 1;
    });
  }, []);

  const goNextMonth = useCallback(() => {
    setHoverDate(null);
    setViewMonthIndex((month) => {
      if (month === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return month + 1;
    });
  }, []);

  const isRangeStart = useCallback(
    (date: Date) => !!value.start && isSameYMD(date, value.start),
    [value.start],
  );

  const isRangeEnd = useCallback(
    (date: Date) => !!value.end && isSameYMD(date, value.end),
    [value.end],
  );

  const previewRange = useMemo(() => {
    if (value.start && value.end) {
      return { start: value.start, end: value.end };
    }
    if (value.start && hoverDate) {
      const start =
        compareYMD(hoverDate, value.start) < 0 ? hoverDate : value.start;
      const end =
        compareYMD(hoverDate, value.start) < 0 ? value.start : hoverDate;
      return { start, end };
    }
    return null;
  }, [value.start, value.end, hoverDate]);

  const isInRange = useCallback(
    (date: Date) =>
      previewRange
        ? isBetweenYMD(date, previewRange.start, previewRange.end)
        : false,
    [previewRange],
  );

  const selectDate = useCallback(
    (clicked: Date) => {
      const nextRange = applyRangeClick(value, clicked);
      onChange(nextRange);
    },
    [value, onChange],
  );

  function getDayProps(cell: DayCell) {
    const { date, disabled } = cell;
    const selected = isInRange(date);

    return {
      role: "gridcell" as const,
      tabIndex: disabled ? -1 : 0,
      "aria-disabled": disabled || undefined,
      "aria-selected": selected || undefined,
      onClick: () => {
        if (!disabled) {
          selectDate(date);
        }
      },
      onMouseEnter: () => {
        if (!disabled) {
          setHoverDate(date);
        }
      },
      onMouseLeave: () => setHoverDate(null),
    };
  }

  const monthLabel = useMemo(() => {
    return `${viewYear}.${String(viewMonthIndex + 1).padStart(2, "0")}`;
  }, [viewYear, viewMonthIndex]);

  return {
    weeks,
    monthLabel,
    viewYear,
    viewMonthIndex,
    goPrevMonth,
    goNextMonth,
    isRangeStart,
    isRangeEnd,
    isInRange,
    getDayProps,
  };
}
