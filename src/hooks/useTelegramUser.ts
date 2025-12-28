import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const useTelegramUser = () => {
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Priority 1: Check route params (e.g., /user/7670202213)
    if (routeUserId) {
      setTelegramUserId(routeUserId);
      console.log('User ID from route:', routeUserId);
      setIsLoading(false);
      return;
    }

    // Priority 2: Try to get user ID from Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    
    if (userId) {
      setTelegramUserId(String(userId));
      console.log('Telegram user ID:', userId);
    } else {
      // Priority 3: Check URL params for testing (e.g., ?user_id=7670202213)
      const urlParams = new URLSearchParams(window.location.search);
      const testUserId = urlParams.get('user_id');
      
      if (testUserId) {
        setTelegramUserId(testUserId);
        console.log('Test user ID from URL:', testUserId);
      }
    }
    
    setIsLoading(false);
  }, [routeUserId]);

  return { telegramUserId, isLoading };
};