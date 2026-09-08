import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load information from the server. Please check your network or try again.',
  onRetry,
}) => {
  return (
    <div className="bg-red-50/90 dark:bg-obsidian-100 border border-vermilion/30 dark:border-vermilion/40 rounded-2xl p-5 shadow-warm-sm max-w-xl mx-auto my-6 text-charcoal dark:text-stone-100">
      <div className="flex items-start space-x-3.5">
        <AlertCircle className="w-5 h-5 text-vermilion shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-vermilion-deep dark:text-vermilion-light">{title}</h4>
          <p className="text-xs text-charcoal-muted dark:text-stone-300 mt-1 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center space-x-1.5 bg-vermilion text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-vermilion-dark active:scale-95 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

