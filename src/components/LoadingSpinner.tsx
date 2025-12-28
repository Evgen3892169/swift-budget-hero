import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', text, className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className={cn(
          'rounded-full border-2 border-primary/20',
          sizeClasses[size]
        )} />
        {/* Spinning gradient arc */}
        <div className={cn(
          'absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin',
          sizeClasses[size]
        )} />
        {/* Inner pulse */}
        <div className={cn(
          'absolute inset-1 rounded-full bg-primary/10 animate-pulse'
        )} />
      </div>
      {text && (
        <span className="text-sm text-muted-foreground animate-pulse font-medium">
          {text}
        </span>
      )}
    </div>
  );
};

// Card-specific loading placeholder
export const CardLoadingState = ({ rows = 1 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      <LoadingSpinner size="sm" text="Завантаження..." />
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className="h-3 bg-gradient-to-r from-muted via-muted-foreground/5 to-muted rounded animate-pulse"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
};

// Transaction skeleton
export const TransactionLoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-5 w-16 bg-muted rounded animate-pulse" />
    </div>
  );
};
