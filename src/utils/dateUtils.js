import { ZODIAC } from "./constants";

export const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

export function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function sameDay(a, b) {
  return a && b && a.toDateString() === b.toDateString();
}

export function buildCells(y, m) {
  const fd = new Date(y, m, 1).getDay();
  const dim = new Date(y, m + 1, 0).getDate();
  const pd = new Date(y, m, 0).getDate();
  const c = [];
  for (let i = 0; i < fd; i++) c.push({ d: pd - fd + 1 + i, cur: false });
  for (let d = 1; d <= dim; d++) c.push({ d, cur: true });
  while (c.length < 42) c.push({ d: c.length - fd - dim + 1, cur: false });
  return c;
}

export function getZodiac(d) {
  const mo = d.getMonth() + 1, dy = d.getDate();
  for (const z of ZODIAC) {
    const [[sm, sd], [em, ed]] = z.r;
    if ((mo === sm && dy >= sd) || (mo === em && dy <= ed)) return z;
  }
  return ZODIAC[3];
}