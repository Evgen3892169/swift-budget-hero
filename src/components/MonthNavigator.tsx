import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { uk } from 'date-fns/locale';
import { format } from 'date-fns';

interface MonthNavigatorProps {
  monthName: string;
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onDateSelect?: (date: Date) => void;
}

export const MonthNavigator = ({ 
  monthName, 
  currentDate,
  onPrevious, 
  onNext,
  onDateSelect 
}: MonthNavigatorProps) => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onDateSelect) {
      onDateSelect(date);
      setOpen(false);
    }
  };

  // Format the date like "28 грудня"
  const formattedDate = format(currentDate, "d MMMM", { locale: uk });

  return (
    <div className="flex items-center justify-between bg-card rounded-lg p-3 shadow-sm">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onPrevious}
        className="h-10 w-10"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 px-4 text-lg font-semibold capitalize gap-2 hover:bg-secondary"
          >
            <CalendarIcon className="h-5 w-5" />
            {formattedDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-card border-border" 
          align="center"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            initialFocus
            locale={uk}
            className="pointer-events-auto rounded-lg"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center h-10",
              caption_label: "text-base font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-9 w-9 bg-secondary hover:bg-accent inline-flex items-center justify-center rounded-md border-0 opacity-100 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-10 font-normal text-sm",
              row: "flex w-full mt-2",
              cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-secondary rounded-lg transition-colors",
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-lg border-2 border-primary",
              day_today: "bg-secondary text-foreground font-semibold",
              day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onNext}
        className="h-10 w-10"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
