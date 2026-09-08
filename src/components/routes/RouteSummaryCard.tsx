import React, { useState } from 'react';
import { RouteResponseDTO } from '../../types/api';
import { Navigation, Clock, Share2, Check, Footprints, Train, MapPin } from 'lucide-react';

interface RouteSummaryCardProps {
  routeResult: RouteResponseDTO;
}

export const RouteSummaryCard: React.FC<RouteSummaryCardProps> = ({ routeResult }) => {
  const [copied, setCopied] = useState(false);

  const { route, totalDistanceKm, totalWalkingMinutes } = routeResult;
  const metroCount = route.filter((l) => l.type === 'METRO').length;
  const pujaCount = route.filter((l) => l.type === 'PUJA').length;

  const hours = Math.floor(totalWalkingMinutes / 60);
  const minutes = totalWalkingMinutes % 60;
  const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} mins`;

  // Build full multi-stop Google Maps URL
  const googleMapsRouteUrl = React.useMemo(() => {
    if (!route || route.length === 0) return '#';
    const origin = route[0];
    const destination = route[route.length - 1];
    const intermediate = route.slice(1, -1);

    const waypoints = intermediate
      .map((l) => `${l.latitude},${l.longitude}`)
      .join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=walking`;
    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }
    return url;
  }, [route]);

  const handleShare = async () => {
    const textLines = [
      '🪔 Kolkata Durga Puja Parikrama Route (via PujaPath):',
      ...route.map(
        (leg, i) =>
          `${i + 1}. [${leg.type === 'METRO' ? '🚇 Metro' : '📍 Pandal'}] ${leg.name}${leg.distanceFromPrevKm > 0
            ? ` (+${leg.distanceFromPrevKm} km, ~${leg.walkingMinutes} min)`
            : ''
          }`
      ),
      `\nTotal Distance: ${totalDistanceKm} km | Est. Walk Time: ${formattedTime}`,
      `Navigate on Google Maps: ${googleMapsRouteUrl}`,
    ];

    const sharePayload = textLines.join('\n');

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(sharePayload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-terracotta-50/70 via-ivory-surface to-amber-50/50 dark:from-obsidian-50 dark:via-obsidian-100/90 dark:to-obsidian-50 rounded-2xl sm:rounded-3xl border-2 border-terracotta/30 dark:border-terracotta/40 p-5 sm:p-6 lg:p-7 shadow-warm-md relative overflow-hidden">
      {/* Decorative festive watermark aura */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-vermilion/10 dark:bg-vermilion/15 filter blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Stats Grid */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-vermilion text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
            <span>Optimized Parikrama Circuit</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-charcoal dark:text-stone-100">
            {pujaCount} Pandals via {metroCount} Metro Hubs
          </h3>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-1">
            {/* Total Distance */}
            <div className="flex items-center space-x-2 bg-ivory-warm/80 dark:bg-obsidian-200/80 px-3.5 py-2 rounded-xl border border-ivory-border dark:border-obsidian-300">
              <Footprints className="w-5 h-5 text-vermilion shrink-0" />
              <div>
                <p className="text-[10.5px] uppercase tracking-wider text-charcoal-subtle dark:text-stone-400 font-semibold">
                  Total Distance
                </p>
                <p className="text-sm sm:text-base font-bold text-charcoal dark:text-stone-100 font-mono">
                  {totalDistanceKm} km
                </p>
              </div>
            </div>

            {/* Total Walking Time */}
            <div className="flex items-center space-x-2 bg-ivory-warm/80 dark:bg-obsidian-200/80 px-3.5 py-2 rounded-xl border border-ivory-border dark:border-obsidian-300">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-[10.5px] uppercase tracking-wider text-charcoal-subtle dark:text-stone-400 font-semibold">
                  Walking Time
                </p>
                <p className="text-sm sm:text-base font-bold text-charcoal dark:text-stone-100 font-mono">
                  {formattedTime}
                </p>
              </div>
            </div>

            {/* Pandals Count */}
            <div className="flex items-center space-x-2 bg-ivory-warm/80 dark:bg-obsidian-200/80 px-3.5 py-2 rounded-xl border border-ivory-border dark:border-obsidian-300">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10.5px] uppercase tracking-wider text-charcoal-subtle dark:text-stone-400 font-semibold">
                  Pandals
                </p>
                <p className="text-sm sm:text-base font-bold text-charcoal dark:text-stone-100 font-mono">
                  {pujaCount}
                </p>
              </div>
            </div>

            {/* Metro Stops */}
            <div className="flex items-center space-x-2 bg-ivory-warm/80 dark:bg-obsidian-200/80 px-3.5 py-2 rounded-xl border border-ivory-border dark:border-obsidian-300">
              <Train className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-[10.5px] uppercase tracking-wider text-charcoal-subtle dark:text-stone-400 font-semibold">
                  Metro Links
                </p>
                <p className="text-sm sm:text-base font-bold text-charcoal dark:text-stone-100 font-mono">
                  {metroCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <a
            href={googleMapsRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-warm-md hover:shadow-warm-lg transition-[colors,box-shadow] active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center space-x-2 bg-ivory-surface dark:bg-obsidian-100 text-charcoal dark:text-stone-200 hover:text-vermilion dark:hover:text-vermilion-light font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-ivory-border dark:border-obsidian-300 transition-[colors,box-shadow] shadow-xs active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Route Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-charcoal-muted dark:text-stone-400" />
                <span>Share Itinerary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

