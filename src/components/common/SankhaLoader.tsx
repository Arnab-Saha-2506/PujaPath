import React from 'react';

interface SankhaLoaderProps {
  variant?: 'transition' | 'inline' | 'fullscreen';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  subtext?: string;
}

export const SankhaLoader: React.FC<SankhaLoaderProps> = ({
  variant = 'transition',
  size = 'md',
  text = 'শারদোৎসব ২০২৬ • আগমনী বার্তা',
  subtext = 'পুজোযাত্রার পথ সাজছে...',
}) => {
  const sizeConfig = {
    sm: {
      svgSize: 110,
      titleSize: 'text-xs',
      subtextSize: 'text-[10px]',
      dotSize: 'w-1.5 h-1.5',
    },
    md: {
      svgSize: 150,
      titleSize: 'text-sm sm:text-base',
      subtextSize: 'text-xs',
      dotSize: 'w-2 h-2',
    },
    lg: {
      svgSize: 190,
      titleSize: 'text-base sm:text-lg',
      subtextSize: 'text-xs sm:text-sm',
      dotSize: 'w-2.5 h-2.5',
    },
  }[size];

  const content = (
    <div className="flex flex-col items-center justify-center select-none text-center relative">
      {/* Decorative Aura / Radiant Halo */}
      <div className="relative flex items-center justify-center">
        {/* Divine Golden Glow Aura */}
        <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-amber-400/25 via-vermilion/15 to-brass/25 blur-2xl animate-sankha-glow pointer-events-none" />

        {/* Floating Divine Light Sparkles */}
        <div className="absolute -top-3 left-6 w-2 h-2 rounded-full bg-amber-400 animate-sankha-sparkle-1 shadow-[0_0_8px_#F59E0B]" />
        <div className="absolute top-8 -right-2 w-2.5 h-2.5 rounded-full bg-vermilion-light animate-sankha-sparkle-2 shadow-[0_0_8px_#EF4444]" />
        <div className="absolute -bottom-2 left-10 w-1.5 h-1.5 rounded-full bg-amber-300 animate-sankha-sparkle-3 shadow-[0_0_6px_#FCD34D]" />

        {/* The Shankha SVG Illustration with Resonant Soundwaves */}
        <div className="relative animate-sankha-breath">
          <svg
            width={sizeConfig.svgSize}
            height={sizeConfig.svgSize}
            viewBox="0 0 220 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible drop-shadow-[0_8px_18px_rgba(194,94,67,0.22)]"
          >
            <defs>
              {/* Pearl & Ivory Shell Gradient */}
              <linearGradient id="sankhaPearl" x1="50" y1="50" x2="180" y2="170" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FDFBF7" />
                <stop offset="70%" stopColor="#F5ECE0" />
                <stop offset="100%" stopColor="#E6D3BE" />
              </linearGradient>

              {/* Mother of Pearl Highlight */}
              <linearGradient id="sankhaHighlight" x1="70" y1="60" x2="160" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FFF7ED" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
              </linearGradient>

              {/* Conch Aperture / Cavity Depth Gradient */}
              <linearGradient id="sankhaAperture" x1="110" y1="90" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6C2617" />
                <stop offset="45%" stopColor="#991B1B" />
                <stop offset="85%" stopColor="#C25E43" />
                <stop offset="100%" stopColor="#E28F79" />
              </linearGradient>

              {/* Sacred Alta / Vermilion Tip Gradient */}
              <radialGradient id="sankhaAlta" cx="54" cy="62" r="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="65%" stopColor="#991B1B" />
                <stop offset="100%" stopColor="#991B1B" stopOpacity="0" />
              </radialGradient>

              {/* Gold Filigree Line Gradient */}
              <linearGradient id="sankhaGold" x1="50" y1="60" x2="180" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* Radiant Soundwave Gradient */}
              <linearGradient id="soundwaveGold" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#DC2626" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#B45309" stopOpacity="0.3" />
              </linearGradient>

              {/* Soft Drop Shadow for Inner Shell Lip */}
              <filter id="shellShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#753322" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* ================= SOUNDWAVE ARCS (শঙ্খধ্বনি তরঙ্গ) ================= */}
            {/* Wave Arc 1 (Inner Resonant Pulse) */}
            <path
              d="M 46 38 A 30 30 0 0 0 20 74"
              stroke="url(#soundwaveGold)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              className="animate-sankha-wave-1"
            />
            {/* Wave Arc 2 (Mid Resonant Pulse) */}
            <path
              d="M 38 22 A 52 52 0 0 0 2 82"
              stroke="url(#soundwaveGold)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-sankha-wave-2"
            />
            {/* Wave Arc 3 (Outer Divine Resonance) */}
            <path
              d="M 28 6 A 76 76 0 0 0 -18 90"
              stroke="url(#soundwaveGold)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 6"
              fill="none"
              className="animate-sankha-wave-3"
            />

            {/* ================= SHANKHA BODY ================= */}
            {/* Outer Shell Silhouette */}
            <path
              d="M 52 64 C 70 54, 112 48, 146 66 C 178 82, 196 112, 186 142 C 176 168, 142 178, 108 166 C 76 154, 56 128, 60 98 C 62 84, 52 72, 52 64 Z"
              fill="url(#sankhaPearl)"
              filter="url(#shellShadow)"
              stroke="#D1BA9E"
              strokeWidth="1.2"
            />

            {/* Shell Body Whorl Ridges (Anatomical Conch Spiral Grooves) */}
            <path
              d="M 62 68 C 82 66, 122 66, 150 82"
              stroke="#D4BA9F"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 70 78 C 94 78, 134 82, 160 102"
              stroke="#D4BA9F"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 78 90 C 104 94, 142 102, 168 124"
              stroke="#CDB092"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Pearlescent Highlight Glint on Shell Shoulder */}
            <path
              d="M 72 62 C 98 56, 134 56, 162 76 C 178 88, 186 104, 180 122 C 168 98, 136 78, 96 72 Z"
              fill="url(#sankhaHighlight)"
            />

            {/* Conch Aperture / Lip Cavity (Interior Depth Opening) */}
            <path
              d="M 116 92 C 144 100, 164 120, 158 146 C 152 166, 128 168, 110 156 C 96 146, 96 126, 104 108 C 108 98, 112 94, 116 92 Z"
              fill="url(#sankhaAperture)"
              stroke="#B45309"
              strokeWidth="1.2"
            />

            {/* Conch Inner Lip Glaze */}
            <path
              d="M 120 98 C 140 106, 154 122, 150 142 C 146 156, 130 158, 116 150"
              stroke="#FDBA74"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Conch Spire / Apex Coils (শঙ্খের শীর্ষ ও প্যাঁচ) */}
            <path
              d="M 52 64 C 55 58, 62 60, 66 66 C 63 72, 54 71, 52 64 Z"
              fill="url(#sankhaGold)"
            />
            <path
              d="M 58 68 C 64 74, 70 80, 76 88"
              stroke="#B45309"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 66 78 C 73 84, 80 91, 88 100"
              stroke="#B45309"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Auspicious Red Alta Tip (আলতা রাঙানো মুখ) */}
            <ellipse
              cx="54"
              cy="63"
              rx="9"
              ry="7"
              fill="url(#sankhaAlta)"
              transform="rotate(-20 54 63)"
            />

            {/* Sacred Bengali Alpana / Lotus Engraving on Conch Belly */}
            <g transform="translate(86, 108) scale(0.85)" opacity="0.85">
              {/* Central Floral Motif */}
              <circle cx="20" cy="18" r="3.5" fill="#D97706" />
              <path
                d="M 20 8 C 21 13, 23 14, 28 14 C 23 14, 21 16, 20 21 C 19 16, 17 14, 12 14 C 17 14, 19 13, 20 8 Z"
                fill="#C25E43"
              />
              <path
                d="M 20 12 C 24 12, 26 15, 26 18 C 24 18, 22 16, 20 12 Z"
                fill="#F59E0B"
              />
              <path
                d="M 20 12 C 16 12, 14 15, 14 18 C 16 18, 18 16, 20 12 Z"
                fill="#F59E0B"
              />
              {/* Flanking Alpana Dots */}
              <circle cx="6" cy="18" r="1.5" fill="#D97706" />
              <circle cx="34" cy="18" r="1.5" fill="#D97706" />
              <circle cx="20" cy="27" r="1.5" fill="#D97706" />
            </g>

            {/* Auspicious Gold Border Bead Rim */}
            <path
              d="M 152 142 C 150 152, 140 162, 126 164"
              stroke="#D97706"
              strokeWidth="1.5"
              strokeDasharray="1.5 3.5"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Rhythmic Bengali Typography & Soundwave Caption */}
      <div className="mt-4 space-y-1.5">
        <div className="inline-flex items-center space-x-2 bg-ivory-surface dark:bg-obsidian-50/90 border border-terracotta/25 px-4 py-1.5 rounded-full shadow-warm-sm">
          <span className="text-vermilion font-bold animate-pulse text-xs">॥</span>
          <h3 className={`font-bengali font-extrabold text-charcoal dark:text-stone-200 tracking-wide ${sizeConfig.titleSize}`}>
            {text}
          </h3>
          <span className="text-vermilion font-bold animate-pulse text-xs">॥</span>
        </div>

        {subtext && (
          <p className={`font-sans font-medium text-charcoal-muted dark:text-stone-400 tracking-tight ${sizeConfig.subtextSize}`}>
            {subtext}
          </p>
        )}

        {/* Pulsing Sacred Dots */}
        <div className="flex items-center justify-center space-x-2 pt-1">
          <span className={`${sizeConfig.dotSize} rounded-full bg-vermilion animate-ping`} style={{ animationDuration: '1.2s', animationDelay: '0s' }} />
          <span className={`${sizeConfig.dotSize} rounded-full bg-amber-500 animate-ping`} style={{ animationDuration: '1.2s', animationDelay: '0.3s' }} />
          <span className={`${sizeConfig.dotSize} rounded-full bg-terracotta animate-ping`} style={{ animationDuration: '1.2s', animationDelay: '0.6s' }} />
        </div>
      </div>
    </div>
  );

  if (variant === 'fullscreen' || variant === 'transition') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory/85 dark:bg-[#090305]/95 backdrop-blur-md transition-all duration-300">
        {content}
      </div>
    );
  }

  return <div className="py-8 flex items-center justify-center">{content}</div>;
};
