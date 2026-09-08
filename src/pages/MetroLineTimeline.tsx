import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MetroStationResponseDTO } from '../types/api';
import { getStationsByLine } from '../services/metroService';
import { getMetroLineMeta } from '../utils/metroColors';
import { MetroStationTimeline } from '../components/metro/MetroStationTimeline';
import { TimelineSkeleton } from '../components/common/SkeletonLoader';
import { ArrowLeft, Train, MapPin, Activity } from 'lucide-react';

export const MetroLineTimeline: React.FC = () => {
  const { lineName } = useParams<{ lineName: string }>();
  const decodedLine = decodeURIComponent(lineName || 'Blue Line');
  const meta = getMetroLineMeta(decodedLine);

  const [stations, setStations] = useState<MetroStationResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getStationsByLine(decodedLine);
        if (isMounted) setStations(data);
      } catch (err) {
        console.error('Failed to load line stations', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [decodedLine]);

  return (
    <div className="max-w-5xl xl:max-w-6xl mx-auto pb-16 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/metro"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal dark:text-stone-200 hover:text-vermilion transition-colors bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 px-3.5 py-2 rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Metro Lines</span>
        </Link>
      </div>

      {/* Header Banner with Line Color */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white shadow-warm-md relative overflow-hidden"
        style={{ backgroundColor: meta.hex }}
      >
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Train className="w-3.5 h-3.5" />
            <span>{meta.code}</span>
            <span>•</span>
            <span>{meta.status}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-xs">
            {meta.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/90">
            <div className="flex items-center space-x-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>{meta.terminals}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-lg font-semibold">
              <Activity className="w-3.5 h-3.5 text-white" />
              <span>{stations.length} Active Stations</span>
            </div>
          </div>
        </div>

        {/* Decorative background grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      {/* Stations Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-charcoal dark:text-stone-100">Route Stations & Timeline</h2>
          <span className="text-xs text-charcoal-subtle dark:text-stone-400">Click any station to view pandals</span>
        </div>

        {loading ? (
          <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-6 shadow-warm-sm">
            <TimelineSkeleton count={8} />
          </div>
        ) : (
          <MetroStationTimeline lineName={meta.name} stations={stations} />
        )}
      </div>
    </div>
  );
};

