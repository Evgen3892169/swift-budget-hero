import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DayOfMonthPickerProps {
  selectedDay: number | undefined;
  onDayChange: (day: number) => void;
  className?: string;
}

export const DayOfMonthPicker = ({ 
  selectedDay, 
  onDayChange, 
  className 
}: DayOfMonthPickerProps) => {
  const [open, setOpen] = useState(false);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSelect = (day: number) => {
    onDayChange(day);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !selectedDay && "text-muted-foreground",
            className
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {selectedDay ? `${selectedDay} числа` : "День місяця"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start" side="top" sideOffset={4}>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <Button
              key={day}
              variant={selectedDay === day ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                selectedDay === day && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleSelect(day)}
            >
              {day}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
