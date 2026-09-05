import React from 'react';
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
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  const handleCardClick = () => {
    navigate(`/pandals/${pandal.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-ivory-surface rounded-2xl border border-ivory-border hover:border-terracotta/40 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer active:scale-[0.99]"
    >
      {/* Media Header */}
      <div className="relative overflow-hidden">
        {pandal.imageUrl ? (
          <img
            src={pandal.imageUrl}
            alt={pandal.name}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Hide broken image and allow fallback to show
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <PandalFallbackGraphic name={pandal.name} />
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="bg-ivory-surface/90 backdrop-blur-md text-charcoal font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm border border-ivory-border">
            {pandal.areaName || 'South Kolkata'}
          </span>
          {pandal.bestTimeToVisit && (
            <div className="pointer-events-auto">
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

