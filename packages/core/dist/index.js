// src/index.ts
var DAY_MS = 24 * 60 * 60 * 1e3;
function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}
function formatLocalYMD(d) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}
function parseLocalYMD(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}
function combineLocalDateTime(ymd, hm) {
  const [y, m, d] = ymd.split("-").map(Number);
  const [hh, mm] = hm.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}
function compareYMD(a, b) {
  const ay = a.getFullYear(), am = a.getMonth(), ad = a.getDate();
  const by = b.getFullYear(), bm = b.getMonth(), bd = b.getDate();
  if (ay !== by) return ay - by;
  if (am !== bm) return am - bm;
  return ad - bd;
}
function isSameYMD(a, b) {
  return compareYMD(a, b) === 0;
}
function isBetweenYMD(d, start, end) {
  return compareYMD(d, start) >= 0 && compareYMD(d, end) <= 0;
}
function applyRangeClick(current, clicked) {
  const { start, end } = current;
  if (!start || end) return { start: clicked, end: null };
  if (compareYMD(clicked, start) < 0) return { start: clicked, end: null };
  if (compareYMD(clicked, start) === 0) return { start: clicked, end: clicked };
  return { start, end: clicked };
}
function addDays(d, days) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}
function startOfWeek(d, weekStartsOn) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (date.getDay() - weekStartsOn + 7) % 7;
  date.setDate(date.getDate() - diff);
  return date;
}
function buildMonthGrid(params) {
  const { year, monthIndex, weekStartsOn = 1, min, max, isDisabled } = params;
  const firstOfMonth = new Date(year, monthIndex, 1);
  const gridStart = startOfWeek(firstOfMonth, weekStartsOn);
  const weeks = [];
  let cursor = gridStart;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate()
      );
      const inMonth = date.getMonth() === monthIndex;
      const outOfMin = min ? compareYMD(date, min) < 0 : false;
      const outOfMax = max ? compareYMD(date, max) > 0 : false;
      const disabled = outOfMin || outOfMax || (isDisabled ? isDisabled(date) : false);
      week.push({
        date,
        inMonth,
        disabled,
        ymd: formatLocalYMD(date)
      });
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}
function dDayByDate(targetYMD, now = /* @__PURE__ */ new Date()) {
  const target = parseLocalYMD(targetYMD);
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  return Math.round((target.getTime() - today.getTime()) / DAY_MS);
}
function timeLeftMs(target, now = /* @__PURE__ */ new Date()) {
  return target.getTime() - now.getTime();
}
function formatDuration(ms) {
  const sign = ms < 0 ? "-" : "";
  const abs = Math.abs(ms);
  const totalMinutes = Math.floor(abs / 6e4);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor(totalMinutes % (60 * 24) / 60);
  const mins = totalMinutes % 60;
  const parts = [];
  if (days) parts.push(`${days}\uC77C`);
  if (hours) parts.push(`${hours}\uC2DC\uAC04`);
  parts.push(`${mins}\uBD84`);
  return sign + parts.join(" ");
}
function countRangeDays(range, mode = "inclusive") {
  if (!range.start || !range.end) return null;
  const start = new Date(
    range.start.getFullYear(),
    range.start.getMonth(),
    range.start.getDate()
  );
  const end = new Date(
    range.end.getFullYear(),
    range.end.getMonth(),
    range.end.getDate()
  );
  const diffDays = Math.round((end.getTime() - start.getTime()) / DAY_MS);
  if (mode === "nights") return Math.max(0, diffDays);
  return Math.max(1, diffDays + 1);
}
export {
  addDays,
  applyRangeClick,
  buildMonthGrid,
  combineLocalDateTime,
  compareYMD,
  countRangeDays,
  dDayByDate,
  formatDuration,
  formatLocalYMD,
  isBetweenYMD,
  isSameYMD,
  parseLocalYMD,
  startOfWeek,
  timeLeftMs
};
