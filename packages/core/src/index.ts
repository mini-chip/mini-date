export function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}
