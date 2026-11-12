export interface Holiday {
  name: string;
  month: number;
  day: number;
  emoji: string;
  description?: string;
}

function nthWeekday(year: number, month: number, weekday: number, n: number): number {
  if (n > 0) {
    const first = new Date(year, month, 1);
    const offset = (weekday - first.getDay() + 7) % 7;
    return 1 + offset + (n - 1) * 7;
  }
  const lastDay = new Date(year, month + 1, 0).getDate();
  const last = new Date(year, month, lastDay);
  const offset = (last.getDay() - weekday + 7) % 7;
  return lastDay - offset;
}

function easterDate(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

export function getHolidaysForYear(year: number): Holiday[] {
  const easter = easterDate(year);
  return [
    { name: "New Year's Day",    month: 0,  day: 1,                              emoji: "🎆", description: "The first day of the new year." },
    { name: "MLK Day",           month: 0,  day: nthWeekday(year, 0, 1, 3),      emoji: "✊", description: "Honoring Dr. Martin Luther King Jr." },
    { name: "Valentine's Day",   month: 1,  day: 14,                             emoji: "❤️", description: "A day to celebrate love and affection." },
    { name: "Presidents' Day",   month: 1,  day: nthWeekday(year, 1, 1, 3),      emoji: "🇺🇸", description: "Honoring all U.S. presidents." },
    { name: "St. Patrick's Day", month: 2,  day: 17,                             emoji: "🍀", description: "Irish cultural and religious holiday." },
    { name: "April Fools' Day",  month: 3,  day: 1,                              emoji: "🃏", description: "A day of jokes and pranks." },
    { name: "Easter",            month: easter.month, day: easter.day,            emoji: "🐣", description: "Christian holiday celebrating the resurrection." },
    { name: "Mother's Day",      month: 4,  day: nthWeekday(year, 4, 0, 2),      emoji: "💐", description: "Celebrating mothers and motherhood." },
    { name: "Cinco de Mayo",     month: 4,  day: 5,                              emoji: "🎉", description: "Commemorates the Mexican army's victory in 1862." },
    { name: "Memorial Day",      month: 4,  day: nthWeekday(year, 4, 1, -1),     emoji: "🎗️", description: "Honoring U.S. military personnel who died in service." },
    { name: "Juneteenth",        month: 5,  day: 19,                             emoji: "✊", description: "Commemorates the emancipation of enslaved people in the U.S." },
    { name: "Father's Day",      month: 5,  day: nthWeekday(year, 5, 0, 3),      emoji: "👔", description: "Celebrating fathers and fatherhood." },
    { name: "Independence Day",  month: 6,  day: 4,                              emoji: "🎆", description: "U.S. Independence Day." },
    { name: "Labor Day",         month: 8,  day: nthWeekday(year, 8, 1, 1),      emoji: "👷", description: "Honoring the American labor movement." },
    { name: "Halloween",         month: 9,  day: 31,                             emoji: "🎃", description: "A spooky celebration of costumes and candy." },
    { name: "Thanksgiving",      month: 10, day: nthWeekday(year, 10, 4, 4),     emoji: "🦃", description: "A day of giving thanks." },
    { name: "Christmas",         month: 11, day: 25,                             emoji: "🎄", description: "Celebrating the birth of Jesus Christ." },
  ];
}

export function buildHolidayMap(year: number, month: number): Record<number, Holiday> {
  const map: Record<number, Holiday> = {};
  getHolidaysForYear(year).forEach((h) => {
    if (h.month === month) map[h.day] = h;
  });
  return map;
}

/** Set of all known holiday names (lower-cased) for duplicate detection */
export function getHolidayNameSet(year: number): Set<string> {
  return new Set(getHolidaysForYear(year).map((h) => h.name.toLowerCase()));
}

/** Format a holiday's month+day for a given year */
export function formatHolidayDate(holiday: Holiday, year: number): string {
  const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${MONTH_NAMES[holiday.month]} ${holiday.day}, ${year}`;
}
