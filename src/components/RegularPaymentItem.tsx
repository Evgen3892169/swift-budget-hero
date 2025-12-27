import { RegularPayment } from '@/types/transaction';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RegularPaymentItemProps {
  payment: RegularPayment;
  currency: string;
  onDelete: (id: string) => void;
}

export const RegularPaymentItem = ({ payment, currency, onDelete }: RegularPaymentItemProps) => {
  const isIncome = payment.type === 'income';
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {payment.description}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <p className={cn(
          "text-base font-semibold whitespace-nowrap",
          isIncome ? "text-income" : "text-expense"
        )}>
          {isIncome ? '+' : '-'}{payment.amount.toLocaleString('uk-UA')} {currency}
        </p>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-expense"
          onClick={() => onDelete(payment.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
