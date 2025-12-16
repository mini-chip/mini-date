// src/index.ts
function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}
function formatLocalYMD(d) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}
export {
  formatLocalYMD,
  pad2
};
