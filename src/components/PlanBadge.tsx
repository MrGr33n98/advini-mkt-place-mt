import { PlanType } from '@/types/lawyer';
import { Crown, Star, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanBadgeProps {
  plan: PlanType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const planConfig = {
  basic: {
    label: 'Basic',
    icon: Shield,
    colors: 'bg-gray-100 text-gray-700 border-gray-200',
    iconColor: 'text-gray-500',
  },
  silver: {
    label: 'Silver',
    icon: Star,
    colors: 'bg-slate-100 text-slate-700 border-slate-300',
    iconColor: 'text-slate-500',
  },
  gold: {
    label: 'Gold',
    icon: Crown,
    colors: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-300',
    iconColor: 'text-amber-600',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'px-3 py-1.5 text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'px-4 py-2 text-base',
    icon: 'w-5 h-5',
  },
};

export function PlanBadge({ 
  plan, 
  size = 'md', 
  showIcon = true, 
  className 
}: PlanBadgeProps) {
  const config = planConfig[plan];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.colors,
        sizeStyles.container,
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(sizeStyles.icon, config.iconColor)} />
      )}
      <span>{config.label}</span>
    </div>
  );
}