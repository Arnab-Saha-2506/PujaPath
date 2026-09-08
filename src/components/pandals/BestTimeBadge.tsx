import React from 'react';
import { Clock, Sunset, Moon, Sun } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BestTimeBadgeProps {
  timeSlot?: string | null;
  className?: string;
}

export const BestTimeBadge: React.FC<BestTimeBadgeProps> = ({
  timeSlot,
  className = '',
}) => {
  if (!timeSlot) return null;

  const slotLower = timeSlot.toLowerCase();

  let Icon = Clock;
  let bgClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700/40';

  if (slotLower.includes('night') || slotLower.includes('midnight')) {
    Icon = Moon;
    bgClass = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/40';
  } else if (slotLower.includes('evening') || slotLower.includes('sunset')) {
    Icon = Sunset;
    bgClass = 'bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-700/40';
  } else if (slotLower.includes('morning')) {
    Icon = Sun;
    bgClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-700/40';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium border',
        bgClass,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      <span>Best time: {timeSlot}</span>
    </span>
  );
};

