import React from 'react';
import { RouteLegDTO } from '../../types/api';
import { Train, MapPin, Footprints, ExternalLink } from 'lucide-react';
import { getMetroLineMeta } from '../../utils/metroColors';
import { openNavigation } from '../../utils/navigation';

interface RouteTimelineLegProps {
  leg: RouteLegDTO;
  index: number;
  isLast: boolean;
}

export const RouteTimelineLeg: React.FC<RouteTimelineLegProps> = ({ leg, index, isLast }) => {
  const isMetro = leg.type === 'METRO';
  const metroMeta = leg.metroLine ? getMetroLineMeta(leg.metroLine) : null;

  return (
    <div className="relative flex items-start space-x-3 sm:space-x-4 group">
      {/* Step Marker Node */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm shadow-warm-sm transition-transform duration-200 group-hover:scale-105 ${isMetro
              ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-blue-500/30'
              : 'bg-vermilion text-white ring-4 ring-vermilion/20 shadow-warm-md'
            }`}
          style={
            isMetro && metroMeta
              ? { backgroundColor: metroMeta.hex, boxShadow: `0 4px 14px ${metroMeta.hex}40` }
              : undefined
          }
        >
          {isMetro ? (
            <Train className="w-5 h-5 text-white" />
          ) : (
            <span className="font-mono">{index + 1}</span>
          )}
        </div>

        {/* Vertical Transit Connector Line */}
        {!isLast && (
          <div className="w-0.5 min-h-[48px] sm:min-h-[56px] my-1 bg-gradient-to-b from-charcoal/20 via-vermilion/30 to-charcoal/20 dark:from-stone-600/30 dark:via-vermilion/40 dark:to-stone-600/30 border-l border-dashed border-charcoal/40 dark:border-stone-500/50" />
        )}
      </div>

      {/* Content Body Card */}
      <div className="flex-1 pb-6">
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-[colors,box-shadow] duration-200 shadow-xs hover:shadow-warm-sm ${isMetro
              ? 'bg-blue-50/60 dark:bg-obsidian-100/80 border-blue-200 dark:border-blue-900/50'
              : 'bg-ivory-surface dark:bg-obsidian-50 border-ivory-border dark:border-obsidian-300'
            }`}
        >
          {/* Badge Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center space-x-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isMetro
                    ? 'bg-blue-600/15 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-400/30'
                    : 'bg-vermilion/15 text-vermilion-dark dark:text-vermilion-light border border-vermilion/30'
                  }`}
              >
                {isMetro ? (
                  <>
                    <Train className="w-3 h-3" />
                    <span>Transit Station</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>Durga Puja Pandal</span>
                  </>
                )}
              </span>

              {isMetro && leg.metroLine && (
                <span
                  className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md text-white shadow-2xs"
                  style={{ backgroundColor: metroMeta?.hex || '#0072CE' }}
                >
                  {leg.metroLine}
                </span>
              )}
            </div>

            {/* Distance / Walking from prev leg */}
            {leg.distanceFromPrevKm > 0 && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-charcoal-muted dark:text-stone-300 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md">
                <Footprints className="w-3 h-3 text-vermilion" />
                <span>
                  {leg.walkingMinutes} min walk ({leg.distanceFromPrevKm} km)
                </span>
              </span>
            )}
          </div>

          {/* Leg Title */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-charcoal dark:text-stone-100 group-hover:text-vermilion transition-colors">
                {leg.name}
              </h4>
              <p className="text-xs text-charcoal-subtle dark:text-stone-400 mt-0.5">
                {isMetro
                  ? `Board or deboard metro here for seamless walking access`
                  : `Festive Puja Committee & Darshan venue`}
              </p>
            </div>

            {/* Direct Navigation Button */}
            <button
              onClick={() => openNavigation(leg.latitude, leg.longitude, leg.name)}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-terracotta dark:text-amber-300 hover:text-vermilion dark:hover:text-amber-200 transition-colors p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              title="Navigate to location"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

