import { Home, History, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Головна', path: '/' },
    { icon: BarChart3, label: 'Аналітика', path: '/analytics' },
    { icon: History, label: 'Історія', path: '/history' },
    { icon: Settings, label: 'Налаштування', path: '/settings' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 transition-all", 
                  isActive && "drop-shadow-[0_0_10px_hsl(168,80%,48%)]"
                )} 
              />
              <span className={cn(
                "text-[10px] mt-1.5 font-medium tracking-wide",
                isActive && "text-primary"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
