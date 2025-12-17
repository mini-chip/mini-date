type DateRange = {
    start: Date | null;
    end: Date | null;
};
type DayCell = {
    date: Date;
    inMonth: boolean;
    disabled: boolean;
    ymd: string;
};
declare function formatLocalYMD(d: Date): string;
declare function parseLocalYMD(ymd: string): Date;
declare function combineLocalDateTime(ymd: string, hm: string): Date;
declare function compareYMD(a: Date, b: Date): number;
declare function isSameYMD(a: Date, b: Date): boolean;
declare function isBetweenYMD(d: Date, start: Date, end: Date): boolean;
declare function applyRangeClick(current: DateRange, clicked: Date): DateRange;
declare function addDays(d: Date, days: number): Date;
declare function startOfWeek(d: Date, weekStartsOn: 0 | 1): Date;
declare function buildMonthGrid(params: {
    year: number;
    monthIndex: number;
    weekStartsOn?: 0 | 1;
    min?: Date;
    max?: Date;
    isDisabled?: (d: Date) => boolean;
}): DayCell[][];
declare function dDayByDate(targetYMD: string, now?: Date): number;
declare function timeLeftMs(target: Date, now?: Date): number;
declare function formatDuration(ms: number): string;
declare function countRangeDays(range: DateRange, mode?: "inclusive" | "nights"): number | null;

export { type DateRange, type DayCell, addDays, applyRangeClick, buildMonthGrid, combineLocalDateTime, compareYMD, countRangeDays, dDayByDate, formatDuration, formatLocalYMD, isBetweenYMD, isSameYMD, parseLocalYMD, startOfWeek, timeLeftMs };
