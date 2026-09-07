import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PandalResponseDTO } from '../../types/api';
import { PandalFallbackGraphic } from './PandalFallbackGraphic';
import { DistanceBadge } from './DistanceBadge';
import { BestTimeBadge } from './BestTimeBadge';
import { MapPin, ArrowRight, Navigation } from 'lucide-react';

interface PandalCardProps {
  pandal: PandalResponseDTO;
  showDistance?: boolean;
}

export const PandalCard: React.FC<PandalCardProps> = ({ pandal, showDistance = true }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  const handleCardClick = () => {
    navigate(`/pandals/${pandal.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-ivory-surface rounded-2xl border border-ivory-border hover:border-terracotta/40 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer active:scale-[0.99]"
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

        {/* Top Badges Overlay - Protected against narrow screen wrapping */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
          <span className="bg-charcoal/75 backdrop-blur-md text-white font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm border border-white/20 truncate max-w-[55%]">
            {pandal.areaName || 'South Kolkata'}
          </span>
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

          <h3 className="text-lg font-bold text-charcoal group-hover:text-vermilion transition-colors line-clamp-1">
            {pandal.name}
          </h3>

          <div className="flex items-start space-x-1.5 mt-1.5 text-xs text-charcoal-muted line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-vermilion shrink-0 mt-0.5" />
            <span>{pandal.address}</span>
          </div>

          <p className="mt-2 text-xs text-charcoal-subtle line-clamp-2 leading-relaxed">
            {pandal.description}
          </p>
        </div>

        {/* Action Footer */}
        <div className="mt-4 pt-3 border-t border-ivory-muted flex items-center justify-between">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open directions in Google Maps"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-terracotta hover:text-vermilion transition-colors px-2 py-1 rounded-lg hover:bg-terracotta-50 border border-transparent hover:border-terracotta/20"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Maps</span>
          </a>

          <span
            className="inline-flex items-center space-x-1 text-xs font-semibold text-vermilion group-hover:translate-x-0.5 transition-all bg-vermilion/5 group-hover:bg-vermilion/10 px-3 py-1.5 rounded-lg"
          >
            <span>View Pandal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

