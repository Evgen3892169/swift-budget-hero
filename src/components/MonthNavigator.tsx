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
    <div className="flex items-center justify-between bg-card/80 backdrop-blur-sm rounded-2xl p-2 border border-border/50">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onPrevious}
        className="h-10 w-10 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <span className="text-base font-semibold text-foreground tracking-wide">
        {monthName}
      </span>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onNext}
        className="h-10 w-10 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
