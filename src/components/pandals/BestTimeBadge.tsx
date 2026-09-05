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
  let bgClass = 'bg-amber-50 text-amber-800 border-amber-200';

  if (slotLower.includes('night') || slotLower.includes('midnight')) {
    Icon = Moon;
    bgClass = 'bg-indigo-50 text-indigo-900 border-indigo-200';
  } else if (slotLower.includes('evening') || slotLower.includes('sunset')) {
    Icon = Sunset;
    bgClass = 'bg-orange-50 text-orange-900 border-orange-200';
  } else if (slotLower.includes('morning')) {
    Icon = Sun;
    bgClass = 'bg-amber-50 text-amber-900 border-amber-200';
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

