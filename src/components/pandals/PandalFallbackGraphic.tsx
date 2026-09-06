import React from 'react';
import { DurgaEyeIcon } from '../common/DurgaEyeIcon';
import { AlpanaCircle } from '../common/AlpanaMotif';

interface PandalFallbackGraphicProps {
  name: string;
  className?: string;
  variant?: 'card' | 'banner';
}

export const PandalFallbackGraphic: React.FC<PandalFallbackGraphicProps> = ({
  name,
  className = '',
  variant = 'card',
}) => {
  // Deterministic subtle color variations based on pandal name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    'from-[#8E3C26] via-[#C25E43] to-[#991B1B]',
    'from-[#753322] via-[#B45309] to-[#8E3C26]',
    'from-[#991B1B] via-[#C25E43] to-[#B45309]',
    'from-[#7F1D1D] via-[#991B1B] to-[#C25E43]',
  ];
  const bgGradient = gradients[hash % gradients.length];

  if (variant === 'banner') {
    return (
      <div
        className={`relative w-full h-56 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-br ${bgGradient} overflow-hidden flex items-center justify-center ${className}`}
      >
        {/* Background Alpana Motifs */}
        <div className="absolute -left-12 -bottom-12 pointer-events-none opacity-30 text-white">
          <AlpanaCircle size={300} opacity={0.3} />
        </div>
        <div className="absolute -right-12 -top-12 pointer-events-none opacity-30 text-white">
          <AlpanaCircle size={300} opacity={0.3} />
        </div>

        {/* Center Cultural Watermark Icon (Subtle, No text) */}
        <div className="relative z-0 flex flex-col items-center text-center opacity-25 pointer-events-none select-none -translate-y-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 border-2 border-brass/40 p-4 shadow-xl flex items-center justify-center">
            <DurgaEyeIcon size={64} />
          </div>
          <span className="text-white text-xs font-bengali tracking-widest uppercase mt-2">
            শারদোৎসব ২০২৬
          </span>
        </div>

        {/* Bottom subtle shadow vignette for high contrast text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-44 bg-gradient-to-br ${bgGradient} overflow-hidden flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Alpana background motif */}
      <div className="absolute -right-10 -bottom-10 pointer-events-none opacity-25">
        <AlpanaCircle size={170} opacity={0.25} />
      </div>
      <div className="absolute -left-10 -top-10 pointer-events-none opacity-20">
        <AlpanaCircle size={140} opacity={0.2} />
      </div>

      {/* Center Crest */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-13 h-13 rounded-full bg-ivory/95 border border-brass/60 p-2 shadow-md flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
          <DurgaEyeIcon size={34} />
        </div>
        <span className="text-white text-xs font-semibold tracking-wide drop-shadow-xs px-3 py-0.5 bg-black/25 backdrop-blur-xs rounded-full border border-white/20">
          ঐতিহ্যবাহী শারদ সম্মান
        </span>
      </div>

      {/* Decorative red-white border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brass via-ivory to-vermilion opacity-80" />
    </div>
  );
};

