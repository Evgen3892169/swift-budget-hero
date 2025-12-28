import { useState, useEffect } from 'react';

export const useTelegramUser = () => {
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    
    if (userId) {
      setTelegramUserId(String(userId));
      console.log('Telegram user ID:', userId);
    }
    
    setIsLoading(false);
  }, []);

  return { telegramUserId, isLoading };
};