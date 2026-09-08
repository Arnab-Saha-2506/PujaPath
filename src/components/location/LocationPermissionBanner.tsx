import React from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { DurgaEyeIcon } from '../common/DurgaEyeIcon';
import { MapPin, Sparkles } from 'lucide-react';

export const LocationPermissionBanner: React.FC = () => {
  const { status, isLocating, requestLocation, simulateKolkataLocation } = useGeolocation();

  if (status === 'granted') {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-terracotta-50 via-ivory-surface to-ivory-warm dark:from-obsidian-100 dark:via-obsidian-50 dark:to-obsidian-100 rounded-2xl border border-terracotta-200 dark:border-obsidian-300 p-6 sm:p-8 shadow-warm-md my-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-start space-x-4 text-left">
          <div className="w-14 h-14 rounded-2xl bg-vermilion/10 border border-vermilion/20 flex items-center justify-center shrink-0">
            <DurgaEyeIcon size={38} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-vermilion uppercase tracking-wider">
                অবস্থান সক্রিয় করুন
              </span>
              <span className="text-charcoal-subtle dark:text-stone-500 text-xs">•</span>
              <span className="text-xs text-charcoal-muted dark:text-stone-400">Location Discovery</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-charcoal dark:text-stone-100 mt-1">
              Allow location access to discover nearby Puja pandals
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-stone-300 mt-1 max-w-xl leading-relaxed">
              Find walking times and nearest metro stations to iconic pandals from wherever you are in Kolkata.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={requestLocation}
            disabled={isLocating}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-warm-sm active:scale-95 transition-all disabled:opacity-60"
          >
            <MapPin className="w-4 h-4 text-white" />
            <span>{isLocating ? 'Locating...' : 'Enable Location'}</span>
          </button>

          <button
            onClick={simulateKolkataLocation}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-ivory-surface dark:bg-obsidian-50 hover:bg-terracotta-50 dark:hover:bg-obsidian-200 text-terracotta dark:text-amber-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-terracotta-200 dark:border-amber-500/30 shadow-xs active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>South Kolkata Demo (22.518, 88.353)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

