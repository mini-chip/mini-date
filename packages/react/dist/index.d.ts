import { DateRange, DayCell } from '@library-token/core';

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
declare function useRangeCalendar({ value, onChange, weekStartsOn, min, max, isDisabled, initialMonth, }: UseRangeCalendarParams): {
    weeks: DayCell[][];
    monthLabel: string;
    viewYear: number;
    viewMonthIndex: number;
    goPrevMonth: () => void;
    goNextMonth: () => void;
    isRangeStart: (date: Date) => boolean;
    isRangeEnd: (date: Date) => boolean;
    isInRange: (date: Date) => boolean;
    getDayProps: (cell: DayCell) => {
        role: "gridcell";
        tabIndex: number;
        "aria-disabled": true | undefined;
        "aria-selected": true | undefined;
        onClick: () => void;
        onMouseEnter: () => void;
        onMouseLeave: () => void;
    };
};

export { useRangeCalendar };
