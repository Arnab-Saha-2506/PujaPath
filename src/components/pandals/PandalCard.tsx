import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PandalResponseDTO } from '../../types/api';
import { PandalFallbackGraphic } from './PandalFallbackGraphic';
import { DistanceBadge } from './DistanceBadge';
import { BestTimeBadge } from './BestTimeBadge';
import { MapPin, ArrowRight, Navigation, Train } from 'lucide-react';
import { getNearestMetroStation } from '../../utils/nearestMetro';

interface PandalCardProps {
  pandal: PandalResponseDTO;
  showDistance?: boolean;
}

export const PandalCard: React.FC<PandalCardProps> = ({ pandal, showDistance = true }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  const nearestMetro = pandal.nearbyMetroStationName
    ? { name: pandal.nearbyMetroStationName }
    : getNearestMetroStation(pandal.latitude, pandal.longitude);

  const handleCardClick = () => {
    navigate(`/pandals/${pandal.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 hover:border-terracotta/40 dark:hover:border-vermilion/50 shadow-warm-sm hover:shadow-warm-md transition-[colors,box-shadow,transform] duration-300 flex flex-col overflow-hidden relative cursor-pointer active:scale-[0.99]"
    >
      {/* Media Header - Responsive Aspect & Height for All Screen Sizes */}
      <div className="relative overflow-hidden h-48 sm:h-52 md:h-48 lg:h-52 bg-charcoal">
        {pandal.imageUrl && !imgError ? (
          <>
            {/* Ambient Blurred Background Fill to seamlessly handle portrait/tall aspect ratios & PNG transparency */}
            <img
              src={pandal.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-125 opacity-55"
            />
            {/* Focused Foreground Image - Top-weighted 28% positioning preserves Durga idol faces & pandal crowns */}
            <img
              src={pandal.imageUrl}
              alt={pandal.name}
              loading="lazy"
              className="relative w-full h-full object-cover object-[center_28%] group-hover:scale-105 transition-transform duration-500 brightness-[0.93] contrast-[1.03]"
              onError={() => setImgError(true)}
            />
            {/* Multi-layer gradient scrim for badge legibility and bottom blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-black/45 pointer-events-none" />
          </>
        ) : (
          <PandalFallbackGraphic name={pandal.name} />
        )}

        {/* Top Badges Overlay - Two primary navigation tags (Area & Nearby Metro) + Best Time */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 pointer-events-none z-10">
          <div className="flex flex-wrap items-center gap-1.5 max-w-[72%] sm:max-w-[75%]">
            {/* Tag 1: Which part of Kolkata */}
            <span className="bg-black/75 backdrop-blur-md text-white font-semibold text-[10.5px] sm:text-[11px] px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs border border-white/20 flex items-center space-x-1 shrink-0">
              <MapPin className="w-3 h-3 text-vermilion-light shrink-0" />
              <span>{pandal.areaName || 'South Kolkata'}</span>
            </span>

            {/* Tag 2: Nearby Metro Station */}
            {nearestMetro && (
              <span className="bg-black/75 backdrop-blur-md text-emerald-300 font-semibold text-[10.5px] sm:text-[11px] px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs border border-emerald-400/35 flex items-center space-x-1 shrink-0">
                <Train className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{nearestMetro.name} Metro</span>
              </span>
            )}
          </div>

          {pandal.bestTimeToVisit && (
            <div className="pointer-events-auto shrink-0">
              <BestTimeBadge timeSlot={pandal.bestTimeToVisit} />
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Distance Badge if available */}
          {showDistance && (pandal.distanceKm != null || pandal.walkingTimeMinutes != null) && (
            <div className="mb-2">
              <DistanceBadge
                distanceInKm={pandal.distanceKm}
                walkingMinutes={pandal.walkingTimeMinutes}
                variant="pill"
              />
            </div>
          )}

          <h3 className="text-lg font-bold text-charcoal dark:text-stone-100 group-hover:text-vermilion dark:group-hover:text-vermilion-light transition-colors line-clamp-1">
            {pandal.name}
          </h3>

          <div className="flex items-start space-x-1.5 mt-1.5 text-xs text-charcoal-muted dark:text-stone-300 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-vermilion shrink-0 mt-0.5" />
            <span>{pandal.address}</span>
          </div>

          <p className="mt-2 text-xs text-charcoal-subtle dark:text-stone-400 line-clamp-2 leading-relaxed">
            {pandal.description}
          </p>
        </div>

        {/* Action Footer */}
        <div className="mt-4 pt-3 border-t border-ivory-muted dark:border-obsidian-300 flex items-center justify-between">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open directions in Google Maps"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-terracotta dark:text-amber-300 hover:text-vermilion dark:hover:text-amber-200 transition-colors px-2 py-1 rounded-lg hover:bg-terracotta-50 dark:hover:bg-obsidian-200 border border-transparent hover:border-terracotta/20 dark:hover:border-amber-500/20"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Maps</span>
          </a>

          <span
            className="inline-flex items-center space-x-1 text-xs font-semibold text-vermilion dark:text-vermilion-light group-hover:translate-x-0.5 transition-colors bg-vermilion/5 dark:bg-vermilion/15 group-hover:bg-vermilion/10 dark:group-hover:bg-vermilion/25 px-3 py-1.5 rounded-lg"
          >
            <span>View Pandal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

