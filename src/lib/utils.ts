import { type ClassValue, clsx } from "clsx";
import {
  format,
  getMonth,
  getYear,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import pluralize from "pluralize";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Month utility functions
export function getCurrentMonth(): { month: number; year: number } {
  const now = new Date();
  return {
    month: getMonth(now) + 1, // getMonth returns 0-11, we need 1-12
    year: getYear(now),
  };
}

export function getMonthDateRange(
  month: number,
  year: number,
): { start: Date; end: Date } {
  // Create a date in the given month/year (month is 1-12)
  const date = new Date(year, month - 1, 1); // Date constructor expects 0-11 for month

  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

export function formatMonthDisplay(month: number, year: number): string {
  const date = new Date(year, month - 1, 1); // month is 1-12, Date constructor expects 0-11
  const formattedDate = format(date, "MMMM yyyy");
  return formattedDate;
}

export function formatMonthDisplayShort(month: number, year: number): string {
  const date = new Date(year, month - 1, 1); // month is 1-12, Date constructor expects 0-11
  return format(date, "M/yyyy");
}

export function getMonthFromDate(date: Date): { month: number; year: number } {
  return {
    month: getMonth(date) + 1, // getMonth returns 0-11, we need 1-12
    year: getYear(date),
  };
}

export function isCurrentMonth(month: number, year: number): boolean {
  const current = getCurrentMonth();
  return current.month === month && current.year === year;
}

export function isFutureMonth(month: number, year: number): boolean {
  const current = getCurrentMonth();
  return (
    year > current.year || (year === current.year && month > current.month)
  );
}

export function getPreviousMonth(
  month: number,
  year: number,
): { month: number; year: number } {
  if (month === 1) {
    // Previous month is December of previous year
    return { month: 12, year: year - 1 };
  } else {
    return { month: month - 1, year };
  }
}

export function getNextMonth(
  month: number,
  year: number,
): { month: number; year: number } {
  if (month === 12) {
    // Next month is January of next year
    return { month: 1, year: year + 1 };
  } else {
    return { month: month + 1, year };
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
