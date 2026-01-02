import { RegularPayment } from '@/types/transaction';
import { Trash2, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RegularPaymentItemProps {
  payment: RegularPayment;
  currency: string;
  onDelete: (id: string, dayOfMonth?: number) => void;
}

export const RegularPaymentItem = ({ payment, currency, onDelete }: RegularPaymentItemProps) => {
  const isIncome = payment.type === 'income';
  const createdDate = payment.createdAt ? new Date(payment.createdAt) : null;
  const formattedDate = createdDate
    ? createdDate.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {payment.description}
        </p>
        {formattedDate && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {formattedDate}
          </p>
        )}
        {payment.dayOfMonth && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <CalendarDays className="h-3 w-3" />
            <span>{payment.dayOfMonth} числа</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <p className={cn(
          'text-base font-semibold whitespace-nowrap',
          isIncome ? 'text-income' : 'text-expense'
        )}>
          {isIncome ? '+' : '-'}{payment.amount.toLocaleString('uk-UA')} {currency}
        </p>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-expense"
          onClick={() => onDelete(payment.id, payment.dayOfMonth)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
