"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getCurrentISOWeek,
  getWeekFromDate,
  getWeekDateRange,
  formatWeekDisplay,
  getPreviousWeek,
  getNextWeek,
  isCurrentWeek,
  isFutureWeek,
} from "@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";

interface WeekSelectorProps {
  availableWeeks: Array<{ week: number; year: number }>;
}

export function WeekSelector({ availableWeeks }: WeekSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const trpc = useTRPC();

  // Get current week as default
  const currentWeekData = getCurrentISOWeek();

  // Get earliest result week
  const { data: earliestResult } = useQuery(
    trpc.results.getEarliestResult.queryOptions(),
  );

  // Use nuqs to manage week and year in URL query string
  const [currentWeek, setCurrentWeek] = useQueryState(
    "week",
    parseAsInteger.withDefault(currentWeekData.week),
  );
  const [currentYear, setCurrentYear] = useQueryState(
    "year",
    parseAsInteger.withDefault(currentWeekData.year),
  );

  const isCurrent = isCurrentWeek(currentWeek, currentYear);
  const isFuture = isFutureWeek(currentWeek, currentYear);

  // Check if we're at the current week (disable next button)
  const isAtCurrentWeek = isCurrentWeek(currentWeek, currentYear);

  // Check if we're at the earliest result week (disable back button)
  const isAtEarliestWeek =
    earliestResult &&
    currentWeek === earliestResult.week &&
    currentYear === earliestResult.year;

  const handleWeekChange = (week: number, year: number) => {
    setCurrentWeek(week);
    setCurrentYear(year);
  };

  const handlePrevious = () => {
    const prev = getPreviousWeek(currentWeek, currentYear);
    handleWeekChange(prev.week, prev.year);
  };

  const handleNext = () => {
    const next = getNextWeek(currentWeek, currentYear);
    handleWeekChange(next.week, next.year);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const week = getWeekFromDate(date);
      handleWeekChange(week.week, week.year);
      setIsCalendarOpen(false);
    }
  };

  const weekDateRange = getWeekDateRange(currentWeek, currentYear);

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={availableWeeks.length === 0 || isAtEarliestWeek}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[200px] flex-1 justify-start text-left font-normal select-none"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatWeekDisplay(currentWeek, currentYear)}
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

                // Disable dates before earliest result week
                if (earliestResult) {
                  const earliestDate = getWeekDateRange(
                    earliestResult.week,
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
          disabled={isFuture || isAtCurrentWeek}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
