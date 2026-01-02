import { RegularPayment } from '@/types/transaction';
import { Trash2, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RegularPaymentItemProps {
  payment: RegularPayment;
  currency: string;
  onDelete: (id: string, dayOfMonth?: number) => void;
}

export const RegularPaymentItem = ({ payment, currency, onDelete }: RegularPaymentItemProps) => {
  const isIncome = payment.type === 'income';

  const formattedDate = payment.createdAt
    ? format(new Date(payment.createdAt), 'dd.MM.yyyy')
    : undefined;
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {payment.description}
        </p>
        {payment.dayOfMonth && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <CalendarDays className="h-3 w-3" />
            <span>{payment.dayOfMonth} числа</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-end gap-0.5 min-w-[120px]">
        <p
          className={cn(
            'text-base font-semibold whitespace-nowrap',
            isIncome ? 'text-income' : 'text-expense'
          )}
        >
          {isIncome ? '+' : '-'}
          {payment.amount.toLocaleString('uk-UA')} {currency}
        </p>
        {formattedDate && (
          <p className="text-[11px] text-muted-foreground whitespace-nowrap">
            {formattedDate}
          </p>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-expense ml-1"
        onClick={() => onDelete(payment.id, payment.dayOfMonth)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
