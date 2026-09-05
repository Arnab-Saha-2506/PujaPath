import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { DurgaEyeIcon } from './DurgaEyeIcon';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Pandals Found',
  description = 'Try searching with different keywords or switch areas.',
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-ivory-surface rounded-2xl border border-ivory-border p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-warm-sm flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-terracotta-50 border border-terracotta/20 flex items-center justify-center mb-4 shadow-sm">
        <DurgaEyeIcon size={40} />
      </div>
      <h3 className="text-lg font-bold text-charcoal mb-1">{title}</h3>
      <p className="text-xs text-charcoal-muted max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 bg-vermilion text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-vermilion-dark active:scale-95 transition-all shadow-warm-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

