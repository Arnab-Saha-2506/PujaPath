import React from 'react';
import { MessageSquareHeart } from 'lucide-react';

interface FloatingContactButtonProps {
  onClick: () => void;
}

export const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 group">
      <button
        onClick={onClick}
        title="Contact Us / বার্তা পাঠান"
        aria-label="Open Contact Us modal"
        className="relative flex items-center space-x-2 bg-gradient-to-r from-vermilion via-vermilion-deep to-terracotta hover:from-vermilion-dark hover:to-vermilion text-white px-3.5 py-3 md:px-4 md:py-3.5 rounded-full shadow-warm-md hover:shadow-warm-lg transition-all duration-300 active:scale-95 group-hover:scale-105 border border-white/20 cursor-pointer"
      >
        {/* Ambient subtle ping beacon */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-white"></span>
        </span>

        <MessageSquareHeart className="w-5 h-5 text-white shrink-0 animate-in" />
        <span className="text-xs md:text-sm font-bold tracking-tight hidden sm:inline">
          Contact Us
        </span>
        <span className="text-[11px] font-bengali opacity-90 hidden lg:inline">
          • বার্তা দিন
        </span>
      </button>
    </div>
  );
};
