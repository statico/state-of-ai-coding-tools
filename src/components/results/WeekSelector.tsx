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

interface WeekSelectorProps {
  currentWeek: number;
  currentYear: number;
  availableWeeks: Array<{ week: number; year: number }>;
  onWeekChange: (week: number, year: number) => void;
}

export function WeekSelector({
  currentWeek,
  currentYear,
  availableWeeks,
  onWeekChange,
}: WeekSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const current = getCurrentISOWeek();
  const isCurrent = isCurrentWeek(currentWeek, currentYear);
  const isFuture = isFutureWeek(currentWeek, currentYear);

  const handlePrevious = () => {
    const prev = getPreviousWeek(currentWeek, currentYear);
    onWeekChange(prev.week, prev.year);
  };

  const handleNext = () => {
    const next = getNextWeek(currentWeek, currentYear);
    onWeekChange(next.week, next.year);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const week = getWeekFromDate(date);
      onWeekChange(week.week, week.year);
      setIsCalendarOpen(false);
    }
  };

  const weekDateRange = getWeekDateRange(currentWeek, currentYear);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={availableWeeks.length === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatWeekDisplay(currentWeek, currentYear)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={isFuture}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {isCurrent && (
        <div className="text-muted-foreground text-sm">
          <span className="font-medium text-amber-600">(Incomplete)</span>
        </div>
      )}
    </div>
  );
}
