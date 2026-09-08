import React, { useEffect, useState, useMemo } from 'react';
import { PandalResponseDTO } from '../types/api';
import { getAllPandals } from '../services/areaService';
import { useGeolocation } from '../hooks/useGeolocation';
import {
  calculateHaversineDistance,
  estimateWalkingTime,
  formatDistance,
  formatWalkingTime,
} from '../utils/distance';
import { PandalCard } from '../components/pandals/PandalCard';
import { PandalGridSkeleton } from '../components/common/SkeletonLoader';
import { AlpanaCircle } from '../components/common/AlpanaMotif';
import { DurgaEyeIcon } from '../components/common/DurgaEyeIcon';
import {
  MapPin,
  RefreshCw,
  Sparkles,
  Navigation,
  SlidersHorizontal,
} from 'lucide-react';

export const Nearby: React.FC = () => {
  const {
    latitude,
    longitude,
    status,
    isLocating,
    error,
    requestLocation,
    refreshLocation,
    simulateKolkataLocation,
  } = useGeolocation();

  const [pandals, setPandals] = useState<PandalResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(10); // Default to max 10 km cap

  // Automatically request location once if status is idle
  useEffect(() => {
    if (status === 'idle') {
      requestLocation();
    }
  }, [status, requestLocation]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getAllPandals();
        if (isMounted) setPandals(data);
      } catch (err) {
        console.error('Failed to load pandals for nearby calculation', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live distances from user's coordinates, cap at 10km & sort ascending
  const sortedPandals = useMemo(() => {
    if (latitude === null || longitude === null) return [];

    const computed = pandals.map((pandal) => {
      const dist = calculateHaversineDistance(
        latitude,
        longitude,
        pandal.latitude,
        pandal.longitude
      );
      return {
        ...pandal,
        distanceKm: dist,
        walkingTimeMinutes: estimateWalkingTime(dist),
      };
    });

    // Strictly enforce 10 km maximum proximity boundary
    const within10Km = computed.filter((p) => p.distanceKm <= 10);
    const sorted = within10Km.sort((a, b) => a.distanceKm - b.distanceKm);

    if (maxDistanceKm < 10) {
      return sorted.filter((p) => p.distanceKm <= maxDistanceKm);
    }

    return sorted;
  }, [pandals, latitude, longitude, maxDistanceKm]);

  // True walkable pandals (<= 1.5 km)
  const walkablePandals = useMemo(() => {
    return sortedPandals.filter((p) => p.distanceKm <= 1.5);
  }, [sortedPandals]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-ivory-surface dark:bg-obsidian-50 rounded-3xl border border-ivory-border dark:border-obsidian-300 p-6 sm:p-8 shadow-warm-sm">
        <div className="absolute -top-12 -right-12 pointer-events-none opacity-20">
          <AlpanaCircle size={220} opacity={0.2} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-vermilion">
              Proximity Radar
            </span>
            <span className="text-xs text-charcoal-subtle dark:text-stone-500">•</span>
            <span className="text-xs font-bengali text-charcoal-muted dark:text-stone-400">আপনার কাছে পুজো</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-stone-200 tracking-tight">
            Puja Near You
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-stone-400 leading-relaxed">
            Discover Durga Puja pandals around your current position. Filter by walking distance,
            check walking time, and navigate seamlessly through Kolkata's festive streets.
          </p>
        </div>
      </div>

      {/* Location Status or Permission Request Banner */}
      {status !== 'granted' ? (
        <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-3xl border border-terracotta/30 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-warm-md flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 pointer-events-none opacity-15 text-vermilion">
            <AlpanaCircle size={180} opacity={0.2} />
          </div>

          <div className="w-20 h-20 rounded-3xl bg-terracotta-50 border-2 border-terracotta/30 p-3 shadow-md flex items-center justify-center mb-4">
            <DurgaEyeIcon size={52} />
          </div>

          <span className="text-xs font-bengali text-vermilion font-bold tracking-wider uppercase mb-1">
            শারদ পরিক্রমা • নিকটবর্তী পুজো
          </span>

          <h3 className="text-xl sm:text-2xl font-bold text-charcoal dark:text-stone-200 mb-2">
            Allow location access to discover nearby Puja pandals
          </h3>

          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-stone-400 max-w-md mb-6 leading-relaxed">
            {error ||
              'We use your browser GPS to compute real-time walking times and closest metro routes to each pandal.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <button
              onClick={requestLocation}
              disabled={isLocating}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-warm-md active:scale-95 transition-colors disabled:opacity-60"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>{isLocating ? 'Locating...' : 'Enable Location'}</span>
            </button>

            <button
              onClick={simulateKolkataLocation}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-terracotta-50 hover:bg-terracotta-100 text-terracotta text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl border border-terracotta-200 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore South Kolkata Demo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Location Info & Filter Bar */}
          <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-4 sm:p-5 shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-leaf/10 border border-leaf/30 flex items-center justify-center text-leaf shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-leaf">GPS Active</span>
                  <span className="text-[11px] text-charcoal-subtle dark:text-stone-500 font-mono">
                    ({latitude?.toFixed(4)}° N, {longitude?.toFixed(4)}° E)
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted dark:text-stone-400">
                  Sorted by closest walking proximity to you
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex items-center space-x-1.5 bg-ivory-warm dark:bg-obsidian-100 px-3 py-1.5 rounded-xl border border-ivory-border dark:border-obsidian-300 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-charcoal-subtle dark:text-stone-400" />
                <span className="text-charcoal-subtle dark:text-stone-400">Radius:</span>
                <select
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                  className="bg-transparent font-semibold text-charcoal dark:text-stone-200 focus:outline-hidden [&>option]:bg-ivory-surface dark:[&>option]:bg-obsidian-100 dark:[&>option]:text-stone-100"
                >
                  <option value={1}>Under 1 km</option>
                  <option value={1.5}>Under 1.5 km (Walkable)</option>
                  <option value={3}>Under 3 km</option>
                  <option value={5}>Under 5 km</option>
                  <option value={10}>Under 10 km (Max)</option>
                </select>
              </div>

              <button
                onClick={refreshLocation}
                disabled={isLocating}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal dark:text-stone-200 hover:text-vermilion bg-ivory-warm dark:bg-obsidian-100 border border-ivory-border dark:border-obsidian-300 px-3 py-2 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Closest Walkable Strips Preview (<= 1.5 km) */}
          {walkablePandals.length > 0 ? (
            <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-leaf/25 dark:border-emerald-700/40 rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-dark dark:text-emerald-400 block mb-1">
                🚶 Closest Walkable Pandals Right Now (&le; 1.5 km)
              </span>
              <div className="flex flex-wrap gap-2">
                {walkablePandals.slice(0, 4).map((pandal) => (
                  <div
                    key={pandal.id}
                    className="inline-flex items-center space-x-2 bg-white dark:bg-obsidian-100 px-3 py-1.5 rounded-xl border border-leaf/20 dark:border-emerald-600/30 text-xs text-charcoal dark:text-stone-200 shadow-xs"
                  >
                    <span className="font-bold text-vermilion">
                      📍 {formatDistance(pandal.distanceKm)}
                    </span>
                    <span className="text-charcoal dark:text-stone-200 font-semibold">• {pandal.name}</span>
                    <span className="text-charcoal-muted dark:text-stone-400">
                      • {formatWalkingTime(pandal.walkingTimeMinutes)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : sortedPandals.length > 0 ? (
            <div className="bg-stone-50 dark:bg-obsidian-200 border border-stone-200/80 dark:border-obsidian-300 rounded-2xl p-4 text-xs text-charcoal-muted dark:text-stone-400 flex items-center justify-between">
              <div>
                <span className="font-semibold text-charcoal dark:text-stone-200">No pandals within 1.5 km walking radius.</span>{' '}
                Nearest pandal is <strong className="text-vermilion">{sortedPandals[0].name}</strong> ({formatDistance(sortedPandals[0].distanceKm)} away).
              </div>
            </div>
          ) : null}

          {/* Pandals Grid */}
          {loading ? (
            <PandalGridSkeleton count={6} />
          ) : sortedPandals.length === 0 ? (
            <div className="text-center py-12 bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-8 max-w-lg mx-auto">
              <p className="text-sm font-bold text-charcoal dark:text-stone-100">
                No pandals found within {maxDistanceKm} km of your coordinates.
              </p>
              <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1.5">
                Pandals beyond 10 km are excluded to focus on your immediate neighbourhood.
              </p>
              <button
                onClick={simulateKolkataLocation}
                className="mt-4 inline-flex items-center space-x-1.5 bg-vermilion text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-warm-sm hover:bg-vermilion-dark transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore South Kolkata Demo (Deshapriyo Park)</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPandals.map((pandal) => (
                <PandalCard key={pandal.id} pandal={pandal} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

