import React from 'react';

interface DurgaEyeIconProps {
  className?: string;
  size?: number;
}

export const DurgaEyeIcon: React.FC<DurgaEyeIconProps> = ({
  className = '',
  size = 28,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
      </defs>

      {/* Left Eye */}
      <path
        d="M12 50 C24 36, 40 36, 48 50 C40 64, 24 64, 12 50 Z"
        stroke="#DC2626"
        strokeWidth="3.2"
        fill="#FAF7F2"
      />
      <ellipse cx="30" cy="50" rx="6" ry="6" fill="#18181B" />
      <circle cx="32" cy="48" r="2" fill="#FFFFFF" />
      <path
        d="M10 47 C22 32, 38 32, 49 47"
        stroke="#991B1B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Right Eye */}
      <path
        d="M52 50 C60 36, 76 36, 88 50 C76 64, 60 64, 52 50 Z"
        stroke="#DC2626"
        strokeWidth="3.2"
        fill="#FAF7F2"
      />
      <ellipse cx="70" cy="50" rx="6" ry="6" fill="#18181B" />
      <circle cx="72" cy="48" r="2" fill="#FFFFFF" />
      <path
        d="M51 47 C62 32, 78 32, 90 47"
        stroke="#991B1B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Third Eye (Trinayan) Center */}
      <path
        d="M50 18 C40 28, 40 38, 50 46 C60 38, 60 28, 50 18 Z"
        stroke="#DC2626"
        strokeWidth="2.6"
        fill="#FAF7F2"
      />
      <ellipse cx="50" cy="32" rx="4" ry="5.5" fill="url(#eyeGradient)" />
      <circle cx="50.5" cy="30.5" r="1.5" fill="#FFFFFF" />

      {/* Vermilion Bindi / Tilak */}
      <circle cx="50" cy="11" r="3.5" fill="#DC2626" />
      <circle cx="50" cy="5" r="1.8" fill="#F59E0B" />

      {/* Nose Ring (Nath) */}
      <path
        d="M58 56 A9 9 0 0 1 45 69"
        stroke="#D97706"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="45" cy="69" r="2" fill="#DC2626" />
    </svg>
  );
};
