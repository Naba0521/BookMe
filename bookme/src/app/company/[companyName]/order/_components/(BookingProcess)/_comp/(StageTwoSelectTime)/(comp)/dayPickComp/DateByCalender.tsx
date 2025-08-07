"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mn } from "date-fns/locale/mn";
import { isToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { CalendarProps } from "../../../../(publicItems)/_OrderPageTypes/types";

function SelectDayOnCalendar({ open, setOpen, setDate, date }: CalendarProps) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <CalendarIcon size={30} />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-2 z-10 flex  bg-white "
        align="center"
      >
        <Calendar
          className="flex gap-3"
          required={true}
          locale={mn}
          mode="single"
          selected={date || undefined}
          buttonVariant="ghost"
          captionLayout="dropdown"
          fromYear={new Date().getFullYear()} 
          toYear={new Date().getFullYear() + 1} 
          onMonthChange={(month: Date) => {
            const today = new Date();
            const isCurrentMonth =
              month.getFullYear() === today.getFullYear() &&
              month.getMonth() === today.getMonth();
            const newDate = isCurrentMonth
              ? today
              : new Date(month.getFullYear(), month.getMonth(), 1);
            setDate(newDate);
          }}
          fromMonth={new Date(new Date().getFullYear(), new Date().getMonth())} // өнөөдрийн сар
          toMonth={
            new Date(new Date().getFullYear(), new Date().getMonth() + 3)
          }
          modifiers={{ today: (date) => isToday(date) }}
          disabled={{ before: new Date() }}
          onSelect={(date) => {
            setDate(date ? date : new Date());
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
export default SelectDayOnCalendar;
