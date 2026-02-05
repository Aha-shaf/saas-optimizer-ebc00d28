import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'border-border',
  primary: 'border-primary/30 bg-primary/5',
  success: 'border-success/30 bg-success/5',
  warning: 'border-warning/30 bg-warning/5',
  danger: 'border-danger/30 bg-danger/5',
};

const iconVariantStyles = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-danger/20 text-danger',
};

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  variant = 'default',
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative rounded-xl border p-6 transition-all duration-200 hover:shadow-lg',
        'bg-gradient-to-br from-card to-card/80',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              {isPositive && (
                <TrendingUp className="w-4 h-4 text-success" />
              )}
              {isNegative && (
                <TrendingDown className="w-4 h-4 text-danger" />
              )}
              {!isPositive && !isNegative && (
                <Minus className="w-4 h-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive && 'text-success',
                  isNegative && 'text-danger',
                  !isPositive && !isNegative && 'text-muted-foreground'
                )}
              >
                {isPositive && '+'}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-muted-foreground">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-lg',
              iconVariantStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
