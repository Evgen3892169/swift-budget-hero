import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransactionType } from '@/types/transaction';

interface AddRegularPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: { type: TransactionType; amount: number; description: string }) => void;
  type: TransactionType;
  currency: string;
}

export const AddRegularPaymentModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  type,
  currency 
}: AddRegularPaymentModalProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !description.trim()) return;
    
    onAdd({
      type,
      amount: numAmount,
      description: description.trim(),
    });
    
    setAmount('');
    setDescription('');
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    onClose();
  };

  const isIncome = type === 'income';
  const isValid = amount && parseFloat(amount) > 0 && description.trim();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold">
            {isIncome ? 'Новий регулярний дохід' : 'Нова регулярна витрата'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Назва
            </Label>
            <Input
              id="description"
              placeholder={isIncome ? "Наприклад: Зарплата" : "Наприклад: Оренда"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 text-base"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Сума ({currency})
            </Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl h-16 font-semibold"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              type="button"
              variant="outline"
              className="flex-1 h-12"
              onClick={handleClose}
            >
              Скасувати
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-12"
              disabled={!isValid}
            >
              Додати
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
