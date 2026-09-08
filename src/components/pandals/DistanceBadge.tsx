import React from 'react';
import { MapPin, Footprints } from 'lucide-react';
import { formatDistance, formatWalkingTime } from '../../utils/distance';
import { cn } from '../../utils/cn';

interface DistanceBadgeProps {
  distanceInKm?: number | null;
  walkingMinutes?: number | null;
  className?: string;
  variant?: 'subtle' | 'solid' | 'pill';
}

export const DistanceBadge: React.FC<DistanceBadgeProps> = ({
  distanceInKm,
  walkingMinutes,
  className = '',
  variant = 'subtle',
}) => {
  if (distanceInKm == null && walkingMinutes == null) {
    return null;
  }

  const distText = formatDistance(distanceInKm);
  const walkText = formatWalkingTime(walkingMinutes);

  if (variant === 'solid') {
    return (
      <div
        className={cn(
          'inline-flex items-center space-x-2 bg-leaf-light/10 text-leaf-dark border border-leaf/20 px-2.5 py-1 rounded-full text-xs font-semibold',
          className
        )}
      >
        <MapPin className="w-3.5 h-3.5 text-leaf" />
        <span>{distText}</span>
        <span className="opacity-40">•</span>
        <Footprints className="w-3.5 h-3.5 text-leaf" />
        <span>{walkText}</span>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'inline-flex items-center space-x-1.5 bg-ivory-surface dark:bg-obsidian-50 text-charcoal-soft dark:text-stone-200 border border-terracotta/20 dark:border-obsidian-300 px-2.5 py-0.5 rounded-full text-[11px] font-medium shadow-xs',
          className
        )}
      >
        <MapPin className="w-3 h-3 text-vermilion" />
        <span>{distText}</span>
        <span className="text-charcoal-subtle dark:text-stone-400 opacity-50">•</span>
        <Footprints className="w-3 h-3 text-terracotta" />
        <span>{walkText}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center space-x-1.5 text-xs text-charcoal-muted dark:text-stone-400 bg-stone-100/90 dark:bg-obsidian-200 px-2 py-0.5 rounded-md border border-stone-200/80 dark:border-obsidian-300',
        className
      )}
    >
      <MapPin className="w-3 h-3 text-vermilion" />
      <span className="font-semibold text-charcoal dark:text-stone-200">{distText}</span>
      <span className="opacity-40">•</span>
      <Footprints className="w-3 h-3 text-terracotta" />
      <span>{walkText}</span>
    </div>
  );
};

