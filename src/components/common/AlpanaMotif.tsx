import React from 'react';

interface AlpanaProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export const AlpanaCircle: React.FC<AlpanaProps> = ({
  className = '',
  size = 180,
  opacity = 0.12,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {/* Central concentric lotus petals */}
      <circle cx="100" cy="100" r="14" stroke="#DC2626" strokeWidth="2.5" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="28" stroke="#C25E43" strokeWidth="1.8" />
      <circle cx="100" cy="100" r="44" stroke="#DC2626" strokeWidth="2" strokeDasharray="5 5" />
      <circle cx="100" cy="100" r="62" stroke="#B45309" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="82" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="95" stroke="#C25E43" strokeWidth="1.5" />

      {/* 8 Petal radial blooms */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <g key={idx} transform={`rotate(${angle} 100 100)`}>
          <path
            d="M100 72 C94 56, 94 44, 100 36 C106 44, 106 56, 100 72 Z"
            stroke="#DC2626"
            strokeWidth="1.8"
            fill="none"
          />
          <circle cx="100" cy="36" r="3" fill="#DC2626" />
          <path
            d="M100 100 L100 20"
            stroke="#C25E43"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          {/* Outer scalloped flourish */}
          <circle cx="100" cy="14" r="2" fill="#B45309" />
        </g>
      ))}

      {/* 16 Micro beads */}
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(
        (angle, idx) => (
          <circle
            key={idx}
            cx={100 + 82 * Math.cos((angle * Math.PI) / 180)}
            cy={100 + 82 * Math.sin((angle * Math.PI) / 180)}
            r="1.8"
            fill="#DC2626"
          />
        )
      )}
    </svg>
  );
};

export const AlpanaDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center space-x-3 text-terracotta/40 ${className}`}>
      <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-terracotta/40"></span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-vermilion">
        <path d="M12 2L14 9L21 9L15 13L17 20L12 15L7 20L9 13L3 9L10 9Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
      <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-terracotta/40"></span>
    </div>
  );
};
