import React from 'react';

export const PandalCardSkeleton: React.FC = () => {
  return (
    <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 overflow-hidden animate-pulse">
      <div className="w-full h-44 bg-stone-200 dark:bg-obsidian-300/70" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-stone-200 dark:bg-obsidian-300 rounded w-2/3" />
        <div className="h-3 bg-stone-200 dark:bg-obsidian-300 rounded w-1/2" />
        <div className="h-3 bg-stone-200 dark:bg-obsidian-300 rounded w-full" />
        <div className="pt-3 border-t border-ivory-muted dark:border-obsidian-400 flex justify-between">
          <div className="h-6 bg-stone-200 dark:bg-obsidian-300 rounded w-16" />
          <div className="h-6 bg-stone-200 dark:bg-obsidian-300 rounded w-24" />
        </div>
      </div>
    </div>
  );
};

export const PandalGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PandalCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const TimelineSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-4 animate-pulse p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-4 h-4 rounded-full bg-stone-200 dark:bg-obsidian-300 shrink-0" />
          <div className="flex-1 h-12 bg-stone-100 dark:bg-obsidian-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

