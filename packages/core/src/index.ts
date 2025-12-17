export type DateRange = { start: Date | null; end: Date | null };

export type DayCell = {
  date: Date;
  inMonth: boolean;
  disabled: boolean;
  ymd: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

export function parseLocalYMD(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function combineLocalDateTime(ymd: string, hm: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  const [hh, mm] = hm.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function compareYMD(a: Date, b: Date): number {
  const ay = a.getFullYear(),
    am = a.getMonth(),
    ad = a.getDate();
  const by = b.getFullYear(),
    bm = b.getMonth(),
    bd = b.getDate();
  if (ay !== by) return ay - by;
  if (am !== bm) return am - bm;
  return ad - bd;
}

export function isSameYMD(a: Date, b: Date): boolean {
  return compareYMD(a, b) === 0;
}

export function isBetweenYMD(d: Date, start: Date, end: Date): boolean {
  return compareYMD(d, start) >= 0 && compareYMD(d, end) <= 0;
}

export function applyRangeClick(current: DateRange, clicked: Date): DateRange {
  const { start, end } = current;
  if (!start || end) return { start: clicked, end: null };
  if (compareYMD(clicked, start) < 0) return { start: clicked, end: null };
  if (compareYMD(clicked, start) === 0) return { start: clicked, end: clicked };
  return { start, end: clicked };
}

export function addDays(d: Date, days: number): Date {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

export function startOfWeek(d: Date, weekStartsOn: 0 | 1): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (date.getDay() - weekStartsOn + 7) % 7;
  date.setDate(date.getDate() - diff);
  return date;
}

export function buildMonthGrid(params: {
  year: number;
  monthIndex: number;
  weekStartsOn?: 0 | 1;
  min?: Date;
  max?: Date;
  isDisabled?: (d: Date) => boolean;
}): DayCell[][] {
  const { year, monthIndex, weekStartsOn = 1, min, max, isDisabled } = params;

  const firstOfMonth = new Date(year, monthIndex, 1);
  const gridStart = startOfWeek(firstOfMonth, weekStartsOn);

  const weeks: DayCell[][] = [];
  let cursor = gridStart;

  for (let w = 0; w < 6; w++) {
    const week: DayCell[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate(),
      );
      const inMonth = date.getMonth() === monthIndex;
      const outOfMin = min ? compareYMD(date, min) < 0 : false;
      const outOfMax = max ? compareYMD(date, max) > 0 : false;
      const disabled =
        outOfMin || outOfMax || (isDisabled ? isDisabled(date) : false);

      week.push({
        date,
        inMonth,
        disabled,
        ymd: formatLocalYMD(date),
      });

      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }

  return weeks;
}

export function dDayByDate(targetYMD: string, now = new Date()): number {
  const target = parseLocalYMD(targetYMD);
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
  return Math.round((target.getTime() - today.getTime()) / DAY_MS);
}

export function timeLeftMs(target: Date, now = new Date()): number {
  return target.getTime() - now.getTime();
}

export function formatDuration(ms: number): string {
  const sign = ms < 0 ? "-" : "";
  const abs = Math.abs(ms);

  const totalMinutes = Math.floor(abs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const mins = totalMinutes % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}일`);
  if (hours) parts.push(`${hours}시간`);
  parts.push(`${mins}분`);
  return sign + parts.join(" ");
}

export function countRangeDays(
  range: DateRange,
  mode: "inclusive" | "nights" = "inclusive",
): number | null {
  if (!range.start || !range.end) return null;
  const start = new Date(
    range.start.getFullYear(),
    range.start.getMonth(),
    range.start.getDate(),
  );
  const end = new Date(
    range.end.getFullYear(),
    range.end.getMonth(),
    range.end.getDate(),
  );
  const diffDays = Math.round((end.getTime() - start.getTime()) / DAY_MS);

  if (mode === "nights") return Math.max(0, diffDays);
  return Math.max(1, diffDays + 1);
}
