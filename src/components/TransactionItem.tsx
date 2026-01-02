import { Transaction } from '@/types/transaction';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionItemProps {
  transaction: Transaction;
  currency: string;
  onDelete?: (id: string) => void;
  showDate?: boolean;
}

export const TransactionItem = ({ 
  transaction, 
  currency, 
  onDelete,
  showDate = false 
}: TransactionItemProps) => {
  const isIncome = transaction.type === 'income';
  const date = new Date(transaction.date);
  const isRegular = transaction.isRegular;
  
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 border-b border-border last:border-0",
        isRegular && "bg-primary/5 border-primary/40 animate-fade-in"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {showDate && (
            <p className="text-xs text-muted-foreground">
              {date.toLocaleDateString('uk-UA', { 
                day: 'numeric', 
                month: 'short',
                year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
              })}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {date.toLocaleTimeString('uk-UA', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </p>
        </div>
        <p className="text-sm font-medium truncate flex items-center gap-1">
          {transaction.description || (isIncome ? 'Дохід' : 'Витрата')}
          {isRegular && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Регулярний
            </span>
          )}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <p className={cn(
          "text-base font-semibold whitespace-nowrap",
          isIncome ? "text-income" : "text-expense"
        )}>
          {isIncome ? '+' : '-'}{transaction.amount.toLocaleString('uk-UA')} {currency}
        </p>
        
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-expense"
            onClick={() => onDelete(transaction.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
