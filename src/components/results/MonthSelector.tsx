"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getCurrentMonth,
  getMonthFromDate,
  getMonthDateRange,
  formatMonthDisplay,
  formatMonthDisplayShort,
  getPreviousMonth,
  getNextMonth,
  isCurrentMonth,
  isFutureMonth,
} from "@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";

interface MonthSelectorProps {
  availableMonths: Array<{ month: number; year: number }>;
}

export function MonthSelector({ availableMonths }: MonthSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const trpc = useTRPC();

  // Get current month as default
  const currentMonthData = getCurrentMonth();

  // Get earliest result month
  const { data: earliestResult } = useQuery(
    trpc.results.getEarliestResult.queryOptions(),
  );

  // Use nuqs to manage month and year in URL query string
  const [currentMonth, setCurrentMonth] = useQueryState(
    "month",
    parseAsInteger.withDefault(currentMonthData.month),
  );
  const [currentYear, setCurrentYear] = useQueryState(
    "year",
    parseAsInteger.withDefault(currentMonthData.year),
  );

  const isCurrent = isCurrentMonth(currentMonth, currentYear);
  const isFuture = isFutureMonth(currentMonth, currentYear);

  // Check if we're at the current month (disable next button)
  const isAtCurrentMonth = isCurrentMonth(currentMonth, currentYear);

  // Check if we're at the earliest result month (disable back button)
  const isAtEarliestMonth =
    earliestResult &&
    currentMonth === earliestResult.month &&
    currentYear === earliestResult.year;

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handlePrevious = () => {
    const prev = getPreviousMonth(currentMonth, currentYear);
    handleMonthChange(prev.month, prev.year);
  };

  const handleNext = () => {
    const next = getNextMonth(currentMonth, currentYear);
    handleMonthChange(next.month, next.year);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const month = getMonthFromDate(date);
      handleMonthChange(month.month, month.year);
      setIsCalendarOpen(false);
    }
  };

  const monthDateRange = getMonthDateRange(currentMonth, currentYear);

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={availableMonths.length === 0 || isAtEarliestMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[200px] flex-1 justify-center text-center font-normal select-none"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">
                {formatMonthDisplay(currentMonth, currentYear)}
              </span>
              <span className="sm:hidden">
                {formatMonthDisplayShort(currentMonth, currentYear)}
              </span>
              {isCurrent && (
                <span className="text-destructive">(Incomplete)</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(23, 59, 59, 999); // End of today

                // Disable future dates
                if (date > today) return true;

                // Disable dates before earliest result month
                if (earliestResult) {
                  const earliestDate = getMonthDateRange(
                    earliestResult.month,
                    earliestResult.year,
                  ).start;
                  return date < earliestDate;
                }

                return false;
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={isFuture || isAtCurrentMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
