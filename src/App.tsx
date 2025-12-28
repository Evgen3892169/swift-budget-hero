import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const sendTelegramUserId = async () => {
      try {
        const tg = (window as any).Telegram?.WebApp;
        const userId = tg?.initDataUnsafe?.user?.id;
        
        if (userId) {
          await fetch('https://gdgsnbkw.app.n8n.cloud/webhook-test/4325a91a-d6f2-4445-baed-3103efc663d5', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'no-cors',
            body: JSON.stringify({ user_id: userId }),
          });
          console.log('Telegram user ID sent:', userId);
        }
      } catch (error) {
        console.error('Error sending Telegram user ID:', error);
      }
    };

    sendTelegramUserId();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
