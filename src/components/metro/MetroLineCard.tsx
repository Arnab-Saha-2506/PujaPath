import React from 'react';
import { Link } from 'react-router-dom';
import { getMetroLineMeta } from '../../utils/metroColors';
import { Train, ArrowRight, Activity, MapPin } from 'lucide-react';

interface MetroLineCardProps {
  lineName: string;
  stationCount?: number;
}

export const MetroLineCard: React.FC<MetroLineCardProps> = ({ lineName, stationCount }) => {
  const meta = getMetroLineMeta(lineName);

  return (
    <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 overflow-hidden shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between group">
      {/* Top Line Color Banner */}
      <div className="p-5 relative overflow-hidden" style={{ backgroundColor: meta.hex }}>
        <div className="relative z-10 flex items-start justify-between text-white">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Train className="w-3.5 h-3.5" />
              <span>{meta.code}</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-xs">
              {meta.name}
            </h3>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              {meta.corridor}
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm p-2 rounded-xl text-white">
            <Train className="w-6 h-6" />
          </div>
        </div>

        {/* Diagonal subtle line pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Terminals */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-charcoal dark:text-stone-200 bg-stone-50 dark:bg-obsidian-200 p-2.5 rounded-xl border border-stone-100 dark:border-obsidian-300">
            <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
            <span className="truncate">{meta.terminals}</span>
          </div>

          {/* Description / Tagline */}
          <p className="text-xs text-charcoal-subtle dark:text-stone-400 leading-relaxed">
            {meta.tagline}
          </p>

          {/* Status & Station Count */}
          <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-stone-400 pt-1">
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-leaf" />
              <span className="font-medium text-charcoal-soft dark:text-stone-300">{meta.status}</span>
            </div>
            {stationCount !== undefined && (
              <span className="bg-ivory-muted dark:bg-obsidian-200 px-2 py-0.5 rounded-md text-[11px] font-semibold text-charcoal-soft dark:text-stone-300">
                {stationCount} Stations
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 pt-4 border-t border-ivory-muted dark:border-obsidian-400">
          <Link
            to={`/metro/lines/${encodeURIComponent(lineName)}`}
            className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-transform active:scale-98 shadow-sm group-hover:shadow"
            style={{ backgroundColor: meta.hex }}
          >
            <span>View Route Stations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

