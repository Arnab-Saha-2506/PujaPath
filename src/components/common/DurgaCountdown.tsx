import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';

const TARGET_DATE = new Date('2026-10-15T00:00:00+05:30'); // Durga Soshthi 2026

export const DurgaCountdown: React.FC = () => {
    const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);

    if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
        return (
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-vermilion to-vermilion-dark text-white px-4 py-1.5 rounded-full shadow-warm-sm">
                <span className="text-xs sm:text-sm font-bold">🪔 Shubho Soshthi!</span>
            </div>
        );
    }

    return (
        <div className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-white/[0.08] dark:bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-amber-400/30 shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-[colors,box-shadow] hover:border-amber-400/50 hover:bg-white/[0.12] select-none">
            {/* Liquid specular highlight on curved upper rim */}
            <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            {/* Ambient liquid glow */}
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500/10 via-vermilion/10 to-amber-500/10 blur-sm opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Festive Label */}
            <div className="relative z-10 flex items-center space-x-1.5 text-amber-300 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-amber-200 drop-shadow-xs">
                    মহাষষ্ঠী :
                </span>
            </div>

            {/* Liquid Glass Digit Capsules */}
            <div className="relative z-10 flex items-center space-x-1 font-mono text-xs sm:text-sm font-extrabold">
                <div className="flex items-baseline px-1.5 sm:px-2 py-0.5 rounded-md bg-black/35 dark:bg-white/[0.08] border border-white/15 text-amber-300 shadow-inner">
                    <span>{days}</span>
                    <span className="text-[9px] sm:text-[10px] font-sans font-semibold text-stone-300 ml-0.5 uppercase">d</span>
                </div>
                <span className="text-amber-300/70 text-xs font-bold">:</span>
                <div className="flex items-baseline px-1.5 sm:px-2 py-0.5 rounded-md bg-black/35 dark:bg-white/[0.08] border border-white/15 text-amber-300 shadow-inner">
                    <span>{String(hours).padStart(2, '0')}</span>
                    <span className="text-[9px] sm:text-[10px] font-sans font-semibold text-stone-300 ml-0.5 uppercase">h</span>
                </div>
                <span className="text-amber-300/70 text-xs font-bold">:</span>
                <div className="flex items-baseline px-1.5 sm:px-2 py-0.5 rounded-md bg-black/35 dark:bg-white/[0.08] border border-white/15 text-amber-300 shadow-inner">
                    <span>{String(minutes).padStart(2, '0')}</span>
                    <span className="text-[9px] sm:text-[10px] font-sans font-semibold text-stone-300 ml-0.5 uppercase">m</span>
                </div>
                <span className="text-amber-300/70 text-xs font-bold">:</span>
                <div className="flex items-baseline px-1.5 sm:px-2 py-0.5 rounded-md bg-black/35 dark:bg-white/[0.08] border border-white/15 text-amber-400 shadow-inner">
                    <span>{String(seconds).padStart(2, '0')}</span>
                    <span className="text-[9px] sm:text-[10px] font-sans font-semibold text-stone-300 ml-0.5 uppercase">s</span>
                </div>
            </div>
        </div>
    );
};