"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

type OrderFiltersProps = {
  search: string;
  setSearch: (val: string) => void;
  filter: string;
  setFilter: (val: string) => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
};

export const OrderFilters = ({
  search,
  setSearch,
  filter,
  setFilter,
  selectedDate,
  setSelectedDate,
}: OrderFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Input
        placeholder="Хайлт..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[200px]"
      />

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Шүүлт" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Бүгд</SelectItem>
          <SelectItem value="today">Өнөөдөр</SelectItem>
          <SelectItem value="week">7 хоног</SelectItem>
          <SelectItem value="month">Энэ сар</SelectItem>
          <SelectItem value="confirmed">Баталгаажсан</SelectItem>
          <SelectItem value="cancelled">Цуцлагдсан</SelectItem>
          <SelectItem value="past">Дууссан</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : "Өдөр сонгох"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
