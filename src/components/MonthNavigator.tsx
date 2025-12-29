import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthNavigatorProps {
  monthName: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const MonthNavigator = ({ 
  monthName, 
  onPrevious, 
  onNext,
}: MonthNavigatorProps) => {
  return (
    <div className="flex items-center justify-between bg-card rounded-xl p-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onPrevious}
        className="h-10 w-10 rounded-lg hover:bg-secondary"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <span className="text-lg font-semibold capitalize text-foreground">
        {monthName}
      </span>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onNext}
        className="h-10 w-10 rounded-lg hover:bg-secondary"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
