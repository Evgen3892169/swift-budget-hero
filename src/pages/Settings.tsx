import { useState, useEffect } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { BottomNav } from '@/components/BottomNav';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { AddRegularPaymentModal } from '@/components/AddRegularPaymentModal';
import { RegularPaymentItem } from '@/components/RegularPaymentItem';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, TrendingUp, TrendingDown, Webhook, User } from 'lucide-react';
import { TransactionType } from '@/types/transaction';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const currencies = [
  { value: 'грн', label: '₴ Гривня (грн)' },
  { value: '$', label: '$ Долар ($)' },
  { value: '€', label: '€ Євро (€)' },
];

const Settings = () => {
  const { telegramUserId, isLoading: isUserLoading } = useTelegramUser();
  
  const {
    settings,
    isLoading,
    updateSettings,
    addRegularPayment,
    deleteRegularPayment,
    addTransaction,
    setTelegramUserId,
  } = useTransactionsContext();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [regularPaymentModal, setRegularPaymentModal] = useState<{
    isOpen: boolean;
    type: TransactionType;
  }>({ isOpen: false, type: 'income' });

  // Set telegram user ID in context
  useEffect(() => {
    if (telegramUserId) {
      setTelegramUserId(telegramUserId);
    }
  }, [telegramUserId, setTelegramUserId]);

  const handleAddRegularPayment = (payment: { type: TransactionType; amount: number; description: string }) => {
    addRegularPayment(payment.type, {
      type: payment.type,
      amount: payment.amount,
      description: payment.description,
    });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Завантаження налаштувань..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-4 space-y-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Налаштування</h1>
        
        {/* User Profile */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/20 p-1.5 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-semibold">Профіль користувача</span>
          </div>
          {telegramUserId ? (
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Telegram User ID</p>
                <p className="text-xl font-bold">{telegramUserId}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Відкрийте додаток через Telegram для відображення профілю
            </p>
          )}
        </div>
        
        {/* Currency */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <Label className="text-base font-semibold mb-3 block">Валюта</Label>
          <Select
            value={settings.currency}
            onValueChange={(value) => updateSettings({ currency: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(currency => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Regular Incomes */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-income/20 p-1.5 rounded-full">
                <TrendingUp className="h-4 w-4 text-income" />
              </div>
              <Label className="text-base font-semibold">Регулярні доходи</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRegularPaymentModal({ isOpen: true, type: 'income' })}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Додати
            </Button>
          </div>
          
          {settings.regularIncomes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Немає регулярних доходів
            </p>
          ) : (
            <div className="space-y-1">
              {settings.regularIncomes.map(payment => (
                <RegularPaymentItem
                  key={payment.id}
                  payment={payment}
                  currency={settings.currency}
                  onDelete={(id) => deleteRegularPayment('income', id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Regular Expenses */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-expense/20 p-1.5 rounded-full">
                <TrendingDown className="h-4 w-4 text-expense" />
              </div>
              <Label className="text-base font-semibold">Регулярні витрати</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRegularPaymentModal({ isOpen: true, type: 'expense' })}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Додати
            </Button>
          </div>
          
          {settings.regularExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Немає регулярних витрат
            </p>
          ) : (
            <div className="space-y-1">
              {settings.regularExpenses.map(payment => (
                <RegularPaymentItem
                  key={payment.id}
                  payment={payment}
                  currency={settings.currency}
                  onDelete={(id) => deleteRegularPayment('expense', id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Integration Info */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/20 p-1.5 rounded-full">
              <Webhook className="h-4 w-4 text-primary" />
            </div>
            <Label className="text-base font-semibold">Інтеграція</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Дані синхронізуються з Google Sheets через n8n. 
            Вручну додані транзакції також відправляються на сервер.
          </p>
        </div>
      </div>

      <BottomNav onAddClick={() => setIsAddModalOpen(true)} />
      
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTransaction}
        currency={settings.currency}
      />
      
      <AddRegularPaymentModal
        isOpen={regularPaymentModal.isOpen}
        onClose={() => setRegularPaymentModal(prev => ({ ...prev, isOpen: false }))}
        onAdd={handleAddRegularPayment}
        type={regularPaymentModal.type}
        currency={settings.currency}
      />
    </div>
  );
};

export default Settings;
