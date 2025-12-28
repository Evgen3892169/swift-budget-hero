import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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
        <div className="py-2">
          <LoadingSpinner size="md" text="Завантаження балансу..." />
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
