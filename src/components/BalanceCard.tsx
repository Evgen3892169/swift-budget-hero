import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Wallet } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  monthName: string;
  currency: string;
  isLoading?: boolean;
}

export const BalanceCard = ({ balance, monthName, currency, isLoading }: BalanceCardProps) => {
  const isPositive = balance >= 0;
  
  return (
    <div className="bg-card rounded-xl p-5 glow-primary">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <p className="text-muted-foreground text-sm">
          Залишок за {monthName}
        </p>
      </div>
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
