import { useState, useEffect } from 'react';

export const useTelegramUser = () => {
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get user ID from Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    
    if (userId) {
      setTelegramUserId(String(userId));
      console.log('Telegram user ID:', userId);
    } else {
      // Check URL params for testing (e.g., ?user_id=7670202213)
      const urlParams = new URLSearchParams(window.location.search);
      const testUserId = urlParams.get('user_id');
      
      if (testUserId) {
        setTelegramUserId(testUserId);
        console.log('Test user ID from URL:', testUserId);
      }
    }
    
    setIsLoading(false);
  }, []);

  return { telegramUserId, isLoading };
};