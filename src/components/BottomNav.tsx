import { Home, History, Settings, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BottomNavProps {
  onAddClick: () => void;
}

export const BottomNav = ({ onAddClick }: BottomNavProps) => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Головна', path: '/' },
    { icon: History, label: 'Історія', path: '/history' },
    { icon: Settings, label: 'Налаштування', path: '/settings' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-pb">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          // Add button in the middle
          if (index === 1) {
            return (
              <div key="add-button-wrapper" className="flex items-center gap-4">
                <Link
                  to={navItems[1].path}
                  className={cn(
                    "flex flex-col items-center py-1 px-3 rounded-lg transition-colors",
                    location.pathname === navItems[1].path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <History className="h-5 w-5" />
                  <span className="text-xs mt-0.5">{navItems[1].label}</span>
                </Link>
                
                <Button
                  onClick={onAddClick}
                  size="icon"
                  className="h-14 w-14 rounded-full shadow-lg -mt-6 bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            );
          }
          
          if (index === 1) return null;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-1 px-3 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
