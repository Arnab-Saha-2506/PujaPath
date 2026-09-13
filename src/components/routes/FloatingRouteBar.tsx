import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRoutePlanner } from '../../context/RouteContext';
import { Train, ArrowRight } from 'lucide-react';

export const FloatingRouteBar: React.FC = () => {
  const { selectedPandalIds } = useRoutePlanner();
  const location = useLocation();

  // Don't show if already on /routes
  if (location.pathname === '/routes' || selectedPandalIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-8 z-40 animate-fade-in">
      <Link
        to="/routes"
        className="group flex items-center space-x-2.5 bg-gradient-to-r from-vermilion-deep to-vermilion text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-warm-lg hover:shadow-warm-xl border border-white/25 backdrop-blur-md transition-[colors,box-shadow,transform] active:scale-95"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Train className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap">
            {selectedPandalIds.length} {selectedPandalIds.length === 1 ? 'Pandal' : 'Pandals'} Selected
          </span>
          <span className="text-[10px] text-amber-200 font-medium">
            Plan Metro Route
          </span>
        </div>
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

