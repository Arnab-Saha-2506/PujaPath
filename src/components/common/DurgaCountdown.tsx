import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

const TARGET_DATE = new Date('2026-10-15T00:00:00+05:30'); // Durga Soshthi 2026

interface DurgaCountdownProps {
  className?: string;
}

export const DurgaCountdown: React.FC<DurgaCountdownProps> = ({ className = '' }) => {
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);

  if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
    return (
      <div className={`inline-flex items-center space-x-2 text-vermilion font-medium text-xs sm:text-sm font-bengali ${className}`}>
        <span>🪔 শুভ শারদোৎসব! পুজো শুরু হয়ে গেছে।</span>
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      className={`inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-center select-none ${className}`}
      aria-label={`Durga Puja countdown: ${days} days, ${hours} hours, ${minutes} minutes`}
    >
      <span className="text-xs sm:text-[13px] font-bengali text-charcoal-muted dark:text-stone-400 font-medium tracking-wide">
        শুভ পুজো শুরু হতে আর
      </span>
      <div className="inline-flex items-center space-x-1.5 font-mono text-xs sm:text-[13px] text-charcoal dark:text-stone-200 font-semibold tracking-tight bg-ivory-surface/80 dark:bg-obsidian-100/80 px-3 py-1 rounded-full border border-ivory-border dark:border-obsidian-300 shadow-xs">
        <span className="text-vermilion dark:text-amber-400 font-bold">{days}</span>
        <span className="text-charcoal-subtle dark:text-stone-400 font-sans text-[11px] uppercase">Days</span>
        <span className="text-charcoal-subtle/50 dark:text-stone-600">·</span>
        <span className="text-vermilion dark:text-amber-400 font-bold">{pad(hours)}</span>
        <span className="text-charcoal-subtle dark:text-stone-400 font-sans text-[11px] uppercase">Hours</span>
        <span className="text-charcoal-subtle/50 dark:text-stone-600">·</span>
        <span className="text-vermilion dark:text-amber-400 font-bold">{pad(minutes)}</span>
        <span className="text-charcoal-subtle dark:text-stone-400 font-sans text-[11px] uppercase">Mins</span>
      </div>
    </div>
  );
};