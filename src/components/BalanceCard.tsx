import { cn } from '@/lib/utils';

interface BalanceCardProps {
  balance: number;
  monthName: string;
  currency: string;
}

export const BalanceCard = ({ balance, monthName, currency }: BalanceCardProps) => {
  const isPositive = balance >= 0;
  
  return (
    <div className="bg-card rounded-lg p-5 shadow-sm">
      <p className="text-muted-foreground text-sm mb-1">
        Залишок за {monthName}
      </p>
      <p className={cn(
        "text-3xl font-bold",
        isPositive ? "text-income" : "text-expense"
      )}>
        {isPositive ? '+' : ''}{balance.toLocaleString('uk-UA')} {currency}
      </p>
    </div>
  );
};
