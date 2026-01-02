import { useState, useEffect } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { BottomNav } from '@/components/BottomNav';
import { AddRegularPaymentModal } from '@/components/AddRegularPaymentModal';
import { RegularPaymentItem } from '@/components/RegularPaymentItem';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, TrendingUp, TrendingDown, User, Users, Trash2, Crown, Mic, ReceiptText } from 'lucide-react';
import { TransactionType } from '@/types/transaction';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const currencies = [
  { value: 'грн', label: '₴ Гривня (грн)' },
  { value: '$', label: '$ Долар ($)' },
  { value: '€', label: '€ Євро (€)' },
];

const Settings = () => {
  const { telegramUserId, telegramUserName, telegramUserAvatar, isLoading: isUserLoading } = useTelegramUser();
  
  const {
    settings,
    updateSettings,
    addRegularPayment,
    deleteRegularPayment,
    setTelegramUserId,
    syncTransactions,
  } = useTransactionsContext();
  
  const [regularPaymentModal, setRegularPaymentModal] = useState<{
     isOpen: boolean;
     type: TransactionType;
   }>({ isOpen: false, type: 'income' });
   const [newCategoryName, setNewCategoryName] = useState('');
   const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
   const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Set telegram user ID in context
  useEffect(() => {
    if (telegramUserId) {
      setTelegramUserId(telegramUserId);
    }
  }, [telegramUserId, setTelegramUserId]);

  const handleAddRegularPayment = async (payment: { type: TransactionType; amount: number; description: string; dayOfMonth?: number }) => {
    addRegularPayment(payment.type, {
      type: payment.type,
      amount: payment.amount,
      description: payment.description,
      dayOfMonth: payment.dayOfMonth,
    });

    if (!telegramUserId) return;

    try {
      await fetch('https://shinespiceclover.app.n8n.cloud/webhook/f5d9f212-83f0-4625-8d59-61cb7bb7119f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: telegramUserId,
          type: payment.type,
          amount: payment.amount,
          date: new Date().toISOString(),
          dayOfMonth: payment.dayOfMonth,
          day_of_month: payment.dayOfMonth,
          description: payment.description,
          name: payment.description,
        }),
      });
    } catch (error) {
      console.error('Не вдалося відправити регулярний платіж на сервер', error);
    }
  };

  const handleDeleteRegularPayment = async (
    type: TransactionType,
    id: string,
    amount: number,
    dayOfMonth?: number
  ) => {
    deleteRegularPayment(type, id);

    if (!telegramUserId) return;

    try {
      await fetch('https://shinespiceclover.app.n8n.cloud/webhook/39ece81c-70b3-481e-a8cc-20420d428714', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: telegramUserId,
          type,
          amount,
          date: new Date().toISOString(),
          dayOfMonth,
          day_of_month: dayOfMonth,
        }),
      });
    } catch (error) {
      console.error('Не вдалося відправити видалення регулярного платежу на сервер', error);
    }
  };

  // Блок сімейного бюджету наразі вимкнений і відображається як "Скоро",
  // тому обробники підключення/відключення не використовуються.

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Введіть назву категорії');
      return;
    }
    if (!telegramUserId) {
      toast.error('Не знайдено ваш User ID');
      return;
    }

    setIsCategorySubmitting(true);
    try {
      await fetch('https://shinespiceclover.app.n8n.cloud/webhook/ad417f87-a904-42a0-8ddb-5de5a18aea26', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: telegramUserId,
          category: newCategoryName.trim(),
        }),
      });

      const existing = settings.categories || [];
      updateSettings({ categories: [...existing, newCategoryName.trim()] });
      setNewCategoryName('');
      setIsCategoryDialogOpen(false);
      toast.success('Категорію додано');
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося додати категорію');
    } finally {
      setIsCategorySubmitting(false);
    }
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
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {telegramUserAvatar ? (
                    <AvatarImage src={telegramUserAvatar} alt={telegramUserName || 'Telegram аватар'} />
                  ) : (
                    <AvatarFallback>
                      {(telegramUserName || 'U')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {telegramUserName || 'Telegram користувач'}
                  </p>
                  <p className="text-xs text-muted-foreground">Telegram User ID: {telegramUserId}</p>
                </div>
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

        {/* Theme */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <Label className="text-base font-semibold mb-3 block">Тема інтерфейсу</Label>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Темна / Світла</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full px-4 text-xs"
              onClick={() => {
                const isDark = document.documentElement.classList.contains('dark');
                if (isDark) {
                  document.documentElement.classList.remove('dark');
                  localStorage.setItem('theme', 'light');
                } else {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('theme', 'dark');
                }
              }}
            >
              Змінити тему
            </Button>
          </div>
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
                  onDelete={(id, dayOfMonth) =>
                    handleDeleteRegularPayment('income', id, payment.amount, dayOfMonth)
                  }
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
                  onDelete={(id, dayOfMonth) =>
                    handleDeleteRegularPayment('expense', id, payment.amount, dayOfMonth)
                  }
                />
              ))}
            </div>
          )}
        </div>


        {/* Categories Management */}
        <div className="bg-card rounded-lg p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              Категорії
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/60">
                <Crown className="h-3 w-3 text-primary" />
                Преміум
              </span>
            </Label>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Додавання власних категорій доступне в преміум-підписці.
          </p>
          <div className="space-y-3 opacity-60 pointer-events-none">
            <Button
              variant="outline"
              className="w-full h-10 justify-center gap-1"
              disabled
            >
              <Plus className="h-4 w-4" />
              Додати категорію (Преміум)
            </Button>

            {/* Діалог лишаємо на майбутнє, зараз недоступний */}
          </div>

          {(!settings.categories || settings.categories.length === 0) ? (
            <p className="text-sm text-muted-foreground mt-4">
              Поки що немає власних категорій
            </p>
          ) : (
            <div className="mt-4 space-y-1">
              {settings.categories.map((category) => (
                <AlertDialog key={category}>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <span className="truncate text-left">{category}</span>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Видалити категорію?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ви впевнені, що хочете видалити категорію «{category}»?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Скасувати</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          if (!telegramUserId) {
                            toast.error('Не знайдено ваш User ID');
                            return;
                          }
                          try {
                              await fetch('https://shinespiceclover.app.n8n.cloud/webhook/da61a718-d050-4d2b-8738-7ea3612c816b', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  user_id: telegramUserId,
                                  category,
                                }),
                              });

                            const existing = settings.categories || [];
                            updateSettings({ categories: existing.filter((c) => c !== category) });
                            toast.success('Категорію видалено');
                          } catch (error) {
                            console.error(error);
                            toast.error('Не вдалося видалити категорію');
                          }
                        }}
                      >
                        Видалити
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}
            </div>
          )}
        </div>

        {/* Family Cabinet */}
        <div className="bg-muted rounded-lg p-4 shadow-sm border border-border/60 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-muted-foreground/10 p-1.5 rounded-full">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <Label className="text-base font-semibold flex items-center gap-2">
              Сімейний бюджет
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-background/60 text-muted-foreground border border-border/60">
                <span>🔒</span>
                <span>Преміум</span>
              </span>
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Ведіть спільний бюджет з родиною: загальні витрати, доходи та ліміти — доступно в преміум-підписці.
          </p>
        </div>

        {/* Premium Feature: Receipt Scanner */}
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-full border border-primary/20">
              <ReceiptText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold flex items-center gap-2">
                Сканер чеків
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/60">
                  <Crown className="h-3 w-3 text-primary" />
                  Преміум
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Скануйте паперові чеки, а суми автоматично потраплятимуть у витрати.
              </p>
            </div>
          </div>
          <Switch disabled className="data-[state=checked]:bg-primary" />
        </div>

        {/* Premium Feature: Voice Records */}
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-full border border-primary/20">
              <Mic className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold flex items-center gap-2">
                Запис голосових
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/60">
                  <Crown className="h-3 w-3 text-primary" />
                  Преміум
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Додавайте витрати голосом — додаток сам перетворить мову в текст.
              </p>
            </div>
          </div>
          <Switch disabled className="data-[state=checked]:bg-primary" />
        </div>
      </div>

      <BottomNav />
      
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
