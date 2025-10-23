import { type ClassValue, clsx } from "clsx";
import {
  addWeeks,
  endOfISOWeek,
  format,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
} from "date-fns";
import pluralize from "pluralize";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Week utility functions
export function getCurrentISOWeek(): { week: number; year: number } {
  const now = new Date();
  return {
    week: getISOWeek(now),
    year: getISOWeekYear(now),
  };
}

export function getWeekDateRange(
  week: number,
  year: number,
): { start: Date; end: Date } {
  // Create a date in the given ISO week/year
  // ISO week 1 is the first week with at least 4 days in the new year
  const jan4 = new Date(year, 0, 4); // January 4th
  const week1Start = startOfISOWeek(jan4);
  const targetWeekStart = addWeeks(week1Start, week - 1);

  return {
    start: startOfISOWeek(targetWeekStart),
    end: endOfISOWeek(targetWeekStart),
  };
}

export function formatWeekDisplay(week: number, year: number): string {
  const weekDateRange = getWeekDateRange(week, year);
  // Use UTC to avoid timezone issues
  const startDate = new Date(weekDateRange.start.getTime());
  const formattedDate = format(startDate, "MMMM d, yyyy");
  return `Week of ${formattedDate}`;
}

export function getWeekFromDate(date: Date): { week: number; year: number } {
  return {
    week: getISOWeek(date),
    year: getISOWeekYear(date),
  };
}

export function isCurrentWeek(week: number, year: number): boolean {
  const current = getCurrentISOWeek();
  return current.week === week && current.year === year;
}

export function isFutureWeek(week: number, year: number): boolean {
  const current = getCurrentISOWeek();
  return year > current.year || (year === current.year && week > current.week);
}

export function getPreviousWeek(
  week: number,
  year: number,
): { week: number; year: number } {
  if (week === 1) {
    // Previous week is week 52 or 53 of previous year
    const prevYear = year - 1;
    const jan4 = new Date(prevYear, 0, 4);
    const week1Start = startOfISOWeek(jan4);
    const lastWeekStart = addWeeks(week1Start, 51); // Week 52
    const lastWeek = getISOWeek(lastWeekStart);
    return { week: lastWeek, year: prevYear };
  } else {
    return { week: week - 1, year };
  }
}

export function getNextWeek(
  week: number,
  year: number,
): { week: number; year: number } {
  const current = getCurrentISOWeek();
  const maxWeek = getISOWeek(new Date(year, 11, 28)); // December 28th to get max week

  if (week >= maxWeek) {
    // Next week is week 1 of next year
    return { week: 1, year: year + 1 };
  } else {
    return { week: week + 1, year };
  }
}

export function formatWithCount(
  count: number,
  word: string,
  locale = "en-US",
): string {
  const formattedNumber = count.toLocaleString(locale);
  const pluralizedWord = pluralize(word, count);
  return `${formattedNumber} ${pluralizedWord}`;
}
