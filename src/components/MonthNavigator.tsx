import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthNavigatorProps {
  monthName: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const MonthNavigator = ({ monthName, onPrevious, onNext }: MonthNavigatorProps) => {
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
      
      <h2 className="text-lg font-semibold capitalize">
        {monthName}
      </h2>
      
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
