import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface BalanceCardProps {
  balance: number;
  monthName: string;
  currency: string;
  isLoading?: boolean;
}

export const BalanceCard = ({ balance, monthName, currency, isLoading }: BalanceCardProps) => {
  const isPositive = balance >= 0;
  
  return (
    <div className="bg-card rounded-lg p-5 shadow-sm">
      <p className="text-muted-foreground text-sm mb-1">
        Залишок за {monthName}
      </p>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
          <Skeleton className="h-9 w-12 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
        </div>
      ) : (
        <p className={cn(
          "text-3xl font-bold transition-all duration-300",
          isPositive ? "text-income" : "text-expense"
        )}>
          {isPositive ? '+' : ''}{balance.toLocaleString('uk-UA')} {currency}
        </p>
      )}
    </div>
  );
};
