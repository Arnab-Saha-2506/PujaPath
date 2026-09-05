import React from 'react';

export const BengaliSideBorder: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const isLeft = side === 'left';

  return (
    <aside
      aria-hidden="true"
      className={`fixed top-0 bottom-0 ${isLeft ? 'left-0' : 'right-0'
        } w-7 2xl:w-10 pointer-events-none hidden xl:flex flex-col justify-between items-center py-6 select-none z-20 overflow-hidden`}
    >
      {/* Outer decorative vertical red stripe (লাল পাড়) */}
      <div
        className={`absolute top-0 bottom-0 ${isLeft ? 'left-0 border-r' : 'right-0 border-l'
          } w-1 bg-gradient-to-b from-vermilion-deep via-vermilion to-terracotta border-brass/40 opacity-70`}
      />

      {/* Repeating Bengali Cultural Motifs (Alpana / Padma / Shankha) */}
      <div className="flex flex-col justify-around h-full space-y-8 opacity-40 hover:opacity-70 transition-opacity">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-vermilion"
            >
              {/* Stylized Lotus Bloom (পদ্ম) */}
              <path
                d="M12 3 C10 8 7 11 3 13 C8 13 10 17 12 21 C14 17 16 13 21 13 C17 11 14 8 12 3 Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="#C25E43"
                fillOpacity="0.15"
              />
              <circle cx="12" cy="13" r="2" fill="#B45309" />
            </svg>
            <div className="w-1 h-3 rounded-full bg-terracotta/40" />
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="text-terracotta"
            >
              <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="8" cy="8" r="1.5" fill="#DC2626" />
            </svg>
          </div>
        ))}
      </div>
    </aside>
  );
};

