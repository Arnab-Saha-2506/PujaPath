import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PandalResponseDTO, AreaResponseDTO } from '../types/api';
import { getAllPandals, getAreas } from '../services/areaService';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';
import { AlpanaCircle, AlpanaDivider } from '../components/common/AlpanaMotif';
import { DurgaEyeIcon } from '../components/common/DurgaEyeIcon';
import { PandalCard } from '../components/pandals/PandalCard';
import { PandalGridSkeleton } from '../components/common/SkeletonLoader';
import {
  MapPin,
  RefreshCw,
  ArrowRight,
  Train,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { DurgaCountdown } from '../components/common/DurgaCountdown';
import { cn } from '../utils/cn';

interface AreaVisualMeta {
  badge: string;
  badgeClass: string;
  countClass: string;
  bengali: string;
  description: string;
  borderClass: string;
  gradientClass: string;
}

const DEFAULT_AREA_METAS: Record<number, AreaVisualMeta> = {
  1: {
    badge: 'Theme Hub',
    badgeClass: 'bg-vermilion text-white',
    countClass: 'text-terracotta dark:text-amber-300',
    bengali: 'দক্ষিণ কলকাতা • ঐতিহ্য ও মেগা থিম পুজো',
    description: "Home to Kolkata's most iconic celebrations: Deshapriyo Park, Ballygunge Cultural, Tridhara, Suruchi Sangha, and Chetla Agrani.",
    borderClass: 'border-2 border-terracotta/40 dark:border-terracotta/30',
    gradientClass: 'from-terracotta-50 via-ivory-surface to-ivory-warm dark:from-obsidian-50 dark:via-obsidian-100/90 dark:to-obsidian-50',
  },
  2: {
    badge: 'Heritage Hub',
    badgeClass: 'bg-leaf text-white',
    countClass: 'text-leaf-dark dark:text-emerald-400',
    bengali: 'উত্তর কলকাতা • বনেদি বাড়ির সাবেকিয়ানা',
    description: 'Centuries-old heritage pujas and clay artisans: Baghbazar Sarbojanin, Kumartuli Park, Sovabazar, Hatkhola, and Jagat Mukherjee Park.',
    borderClass: 'border-2 border-terracotta/30 dark:border-leaf/30',
    gradientClass: 'from-terracotta-50/50 via-ivory-surface to-ivory-warm dark:from-obsidian-50 dark:via-obsidian-100/90 dark:to-obsidian-50',
  },
  3: {
    badge: 'Grand Lighting',
    badgeClass: 'bg-brass text-white',
    countClass: 'text-brass-dark dark:text-amber-300',
    bengali: 'মধ্য কলকাতা • প্রাণকেন্দ্র ও আলোকসজ্জা',
    description: 'Heart of the city famous for lake reflections and architectural replicas: College Square, Md. Ali Park, and Santosh Mitra Square.',
    borderClass: 'border-2 border-amber-300/40 dark:border-brass/30',
    gradientClass: 'from-amber-50/50 via-ivory-surface to-ivory-warm dark:from-obsidian-50 dark:via-obsidian-100/90 dark:to-obsidian-50',
  },
  4: {
    badge: 'Salt Lake & Bypass',
    badgeClass: 'bg-emerald-500 text-white',
    countClass: 'text-emerald-800 dark:text-emerald-300',
    bengali: 'পূর্ব কলকাতা • সল্টলেক ও ইএম বাইপাস',
    description: 'Green Line East-West metro corridor connecting Salt Lake FD Block, BJ Block, and Sreebhumi Sporting Club.',
    borderClass: 'border-2 border-emerald-200/70 dark:border-emerald-500/30',
    gradientClass: 'from-emerald-50/60 via-ivory-surface to-teal-50/40 dark:from-obsidian-50 dark:via-obsidian-100/90 dark:to-obsidian-50',
  },
};

const FALLBACK_PALETTES = [
  {
    badge: 'Popular Zone',
    badgeClass: 'bg-rose-500 text-white',
    countClass: 'text-rose-600 dark:text-rose-400',
    borderClass: 'border-2 border-rose-300/40 dark:border-rose-500/30',
    gradientClass: 'from-rose-50/60 via-ivory-surface to-amber-50/30 dark:from-obsidian-50 dark:via-obsidian-100/90 dark:to-obsidian-50',
  },
  {
    badge: 'Cultural Circuit',
    badgeClass: 'bg-indigo-500 text-white',
    countClass: 'text-indigo-600 dark:text-indigo-400',
    borderClass: 'border-2 border-indigo-300/40 dark:border-indigo-500/30',
    gradientClass: 'from-indigo-50/60 via-ivory-surface to-purple-50/30 dark:from-obsidian-50 dark:via-obsidian-100/90 dark:to-obsidian-50',
  },
  {
    badge: 'Festive Circle',
    badgeClass: 'bg-teal-600 text-white',
    countClass: 'text-teal-700 dark:text-teal-300',
    borderClass: 'border-2 border-teal-300/40 dark:border-teal-500/30',
    gradientClass: 'from-teal-50/60 via-ivory-surface to-emerald-50/30 dark:from-obsidian-50 dark:via-obsidian-100/90 dark:to-obsidian-50',
  },
];

export const Home: React.FC = () => {
  const { latitude, longitude, locality, status, isLocating, requestLocation, refreshLocation, simulateKolkataLocation } =
    useGeolocation();

  const [pandals, setPandals] = useState<PandalResponseDTO[]>([]);
  const [areas, setAreas] = useState<AreaResponseDTO[]>([]);
  const [areaCounts, setAreaCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [areaList, allPandalsData] = await Promise.all([
          getAreas().catch(() => []),
          getAllPandals().catch(() => []),
        ]);

        if (isMounted) {
          setAreas(areaList);
          setPandals(allPandalsData);

          // Calculate counts by area
          const counts: Record<number, number> = {};
          allPandalsData.forEach((p) => {
            counts[p.areaId] = (counts[p.areaId] || 0) + 1;
          });
          setAreaCounts(counts);
        }
      } catch (err) {
        console.error('Failed to load home page data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live distances for pandals if location is available
  const displayPandals = pandals.map((pandal) => {
    if (latitude !== null && longitude !== null) {
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
    }
    return pandal;
  });

  // Curated iconic highlights spanning South, North, Central, and East Kolkata
  const iconicNames = [
    'Deshapriyo Park',
    'Baghbazar',
    'Kumartuli Park',
    'College Square',
    'Tridhara Sammilani',
    'Suruchi Sangha',
    'Md. Ali Park',
    'Sreebhumi',
    'Salt Lake FD',
  ];
  const highlightedPandals = displayPandals
    .filter((p) => iconicNames.some((name) => p.name.toLowerCase().includes(name.toLowerCase())))
    .slice(0, 4);

  // Fallback to first 4 if filter doesn't match
  const fallbackHighlights =
    highlightedPandals.length > 0 ? highlightedPandals : displayPandals.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section with Authentic Bengali Aesthetic & Festive Backdrop Image */}
      <section className="relative overflow-hidden rounded-3xl border border-ivory-border dark:border-obsidian-300 dark:border-blood/40 p-6 sm:p-10 lg:p-14 shadow-warm-md text-white bg-dark-gradient dark:block">
        {/* Background Image with slight blur & gradient scrim for text readability */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/27364815/pexels-photo-27364815.jpeg"
            alt="Durga Puja Kolkata"
            // className="w-full h-full object-cover object-center scale-105 filter blur-[2.5px] brightness-[0.62] contrast-[1.05]"
            className="w-full h-full object-cover object-[center_30%] sm:object-[center_45%] lg:object-[center_55%] scale-105 brightness-[0.78] contrast-[1.05] saturate-[1.1]" />
          {/* Dual-tone gradient scrim for superior text contrast while preserving image aesthetics */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-charcoal/70 to-charcoal/90" /> */}
          {/* <div className="absolute inset-0 bg-gradient-to-tr from-vermilion-deep/25 via-transparent to-amber-950/30 mix-blend-multiply" /> */}
          {/* Light mode gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-charcoal/30 to-charcoal/55 dark:hidden" />
          {/* Dark mode gradient - rich blackish red atmospheric scrim */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#090305]/95 via-[#25070C]/85 to-[#090305]/95 dark:block hidden" />

        </div>

        {/* Subtle Alpana Floral Motifs */}
        <div className="absolute -top-16 -right-16 pointer-events-none opacity-25 text-amber-200 z-1">
          <AlpanaCircle size={320} opacity={0.3} />
        </div>
        <div className="absolute -bottom-20 -left-20 pointer-events-none opacity-20 text-amber-300 z-1">
          <AlpanaCircle size={300} opacity={0.25} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
          {/* Top Festive Header Row: Cultural Pill Badge & Liquid Glass Soshthi Ticker */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <div className="inline-flex items-center space-x-2 bg-black/45 backdrop-blur-md border border-amber-400/40 px-3.5 py-1.5 rounded-full shadow-xs">
              <DurgaEyeIcon size={18} />
              <span className="text-xs sm:text-sm font-bengali font-semibold text-amber-300 tracking-wide drop-shadow-xs">
                শারদোৎসব ২০২৬ • পুজোর কলকাতা
              </span>
            </div>
            <DurgaCountdown />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-sans drop-shadow-md">
            Discover Kolkata's <span className="text-amber-400 font-black">Puja</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Explore heritage & theme pandals, find nearest metro stations, calculate walking
            distances, and navigate your Durga Puja journey with authentic Bengali craftsmanship.
          </p>

          {/* Location CTA Pill */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {status === 'granted' ? (
              <div className="inline-flex items-center space-x-3 bg-black/55 backdrop-blur-md border border-leaf/40 px-4 py-2.5 rounded-2xl shadow-warm-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-leaf"></span>
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  📍 Exploring from current location
                </span>
                {/* NEW: Show locality name or coordinates */}
                {(locality || (latitude !== null && longitude !== null)) && (
                  <span className="text-[11px] text-emerald-200 font-mono bg-black/30 px-2 py-0.5 rounded-full">
                    {locality || `${latitude?.toFixed(2)}°N, ${longitude?.toFixed(2)}°E`}
                  </span>
                )}
                <button
                  onClick={refreshLocation}
                  disabled={isLocating}
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 inline-flex items-center space-x-1 pl-2 border-l border-white/20"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={requestLocation}
                  disabled={isLocating}
                  className="inline-flex items-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-warm-md hover:shadow-warm-lg active:scale-95 transition-[colors,box-shadow] disabled:opacity-60"
                >
                  <MapPin className="w-4 h-4 text-white" />
                  <span>{isLocating ? 'Detecting Location...' : '📍 Use My Location'}</span>
                </button>
                <button
                  onClick={simulateKolkataLocation}
                  className="inline-flex items-center space-x-1.5 bg-black/45 hover:bg-black/65 text-amber-200 border border-amber-400/40 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl backdrop-blur-md shadow-xs transition-colors active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>South Kolkata GPS Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Explore by Area Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-ivory-border dark:border-obsidian-300 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-vermilion font-sans">
                Geographic Zones
              </span>
              <span className="text-xs font-bengali text-charcoal-subtle dark:text-stone-500">অঞ্চল অনুসারে পুজো</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-stone-200 mt-1">
              Explore by Area
            </h2>
          </div>
          <Link
            to="/pandals"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold text-vermilion hover:text-vermilion-dark transition-colors"
          >
            <span>View All {pandals.length > 0 ? `${pandals.length}+` : '180+'} Pandals</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {areas.map((area, idx) => {
            const meta =
              DEFAULT_AREA_METAS[area.id] || FALLBACK_PALETTES[idx % FALLBACK_PALETTES.length];
            const count = areaCounts[area.id] || 0;

            return (
              <div
                key={area.id}
                className={cn(
                  'relative group bg-gradient-to-br rounded-2xl p-6 shadow-warm-sm hover:shadow-warm-md transition-[colors,box-shadow] flex flex-col justify-between',
                  meta.gradientClass,
                  meta.borderClass
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs',
                        meta.badgeClass
                      )}
                    >
                      {meta.badge}
                    </span>
                    <span className={cn('text-xs font-bold', meta.countClass)}>
                      {count > 0 ? `${count}+ Pandals` : 'Explore Zone'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-charcoal dark:text-stone-100 group-hover:text-vermilion transition-colors">
                      {area.name}
                    </h3>
                    <p className="text-xs font-bengali text-charcoal-subtle dark:text-stone-400 mt-0.5">
                      {meta.bengali || `${area.name} • শারদোৎসব পরিক্রমা`}
                    </p>
                  </div>
                  <p className="text-xs text-charcoal-muted dark:text-stone-300 leading-relaxed">
                    {meta.description ||
                      `Discover magnificent pandals, neighborhood celebrations, and cultural festivities across ${area.name}.`}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-ivory-muted dark:border-obsidian-300">
                  <Link
                    to={`/areas/${area.id}/pandals`}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-warm-sm transition-colors"
                  >
                    <span>Explore {area.name.replace(' Kolkata', '')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Quick Highlights Grid / Carousel */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-ivory-border dark:border-obsidian-300 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                Iconic Highlights
              </span>
              <span className="text-xs font-bengali text-charcoal-subtle dark:text-stone-500">কলকাতা জুড়ে সেরা আকর্ষণ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-stone-200 mt-1">
              Iconic Pandals of Kolkata
            </h2>
          </div>
          <Link
            to="/pandals"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold text-vermilion hover:text-vermilion-dark"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <PandalGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fallbackHighlights.map((pandal) => (
              <PandalCard key={pandal.id} pandal={pandal} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Metro Route Finder Callout Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-charcoal via-stone-900 to-charcoal dark:from-obsidian-100 dark:via-[#1c070b] dark:to-obsidian-100 border border-transparent dark:border-obsidian-300 rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
              <Train className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kolkata Metro Network</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-400">Blue, Green, Purple, Orange & Yellow Lines</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Beat the Puja Traffic by Metro
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Find which metro station gets you closest to your favorite pandals. See walking
              minutes, line interchanges, and station route maps.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/routes"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-warm-md hover:shadow-warm-lg transition-[colors,box-shadow] active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Plan Parikrama Route</span>
            </Link>
            <Link
              to="/metro"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 transition-colors active:scale-95"
            >
              <Train className="w-4 h-4 text-emerald-400" />
              <span>Metro Lines</span>
            </Link>
          </div>
        </div>

        {/* Metro line color accents in background */}
        <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-[#0072CE]/20 to-transparent pointer-events-none" />
      </section>

      {/* Decorative Bengali Divider */}
      <AlpanaDivider className="pt-6" />
    </div>
  );
};

