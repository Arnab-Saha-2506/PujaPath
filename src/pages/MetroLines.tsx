import React, { useEffect, useState } from 'react';
import { LineResponseDTO } from '../types/api';
import { getMetroLines } from '../services/metroService';
import { MetroLineCard } from '../components/metro/MetroLineCard';
import { AlpanaCircle } from '../components/common/AlpanaMotif';
import { Train, Info, MapPin } from 'lucide-react';

export const MetroLines: React.FC = () => {
  const [lines, setLines] = useState<LineResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getMetroLines();
        if (isMounted) setLines(data);
      } catch (err) {
        console.error('Failed to load metro lines', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-ivory-surface rounded-3xl border border-ivory-border p-6 sm:p-8 shadow-warm-sm">
        <div className="absolute -top-12 -right-12 pointer-events-none opacity-20">
          <AlpanaCircle size={220} opacity={0.2} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-metro-blue">
              Transit Rapid Network
            </span>
            <span className="text-xs text-charcoal-subtle">•</span>
            <span className="text-xs font-bengali text-charcoal-muted">কলকাতা মেট্রো রেলওয়ে</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Kolkata Metro
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Find the easiest metro route to your Puja destination. Kolkata Metro runs round-the-clock
            special midnight services during Saptami, Ashtami, and Nabami nights.
          </p>
        </div>
      </div>

      {/* Metro Lines Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-charcoal flex items-center space-x-2">
            <Train className="w-5 h-5 text-vermilion" />
            <span>Active Metro Lines ({lines.length || 4})</span>
          </h2>
          <span className="text-xs text-charcoal-subtle">
            Select a line to explore all stations & nearby pandals
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-stone-200/60 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lines.map((line) => (
              <MetroLineCard key={line.name} lineName={line.name} />
            ))}
          </div>
        )}
      </div>

      {/* Puja Special Transit Tips Card */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-charcoal">
          <Info className="w-4 h-4 text-vermilion" />
          <span>Puja Metro Advisory</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-charcoal-muted">
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <strong className="block text-charcoal font-semibold mb-1">
              🌙 Nightlong Trains
            </strong>
            Blue and Green Lines run trains until 4:00 AM on Saptami, Ashtami, and Nabami nights.
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <strong className="block text-charcoal font-semibold mb-1">
              🎟️ Smart Cards & QR
            </strong>
            Purchase digital mobile QR tickets or keep metro smart cards recharged to skip long token queues.
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <strong className="block text-charcoal font-semibold mb-1">
              🔀 Esplanade Junction
            </strong>
            Interchange between Blue Line (North-South) and Green Line (Howrah / Salt Lake) at Esplanade.
          </div>
        </div>
      </div>
    </div>
  );
};

