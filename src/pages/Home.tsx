import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaResponseDTO, PandalResponseDTO } from '../types/api';
import { getAreas, getAllPandals } from '../services/areaService';
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

export const Home: React.FC = () => {
  const { latitude, longitude, status, isLocating, requestLocation, refreshLocation, simulateKolkataLocation } =
    useGeolocation();

  const [areas, setAreas] = useState<AreaResponseDTO[]>([]);
  const [pandals, setPandals] = useState<PandalResponseDTO[]>([]);
  const [areaCounts, setAreaCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [areasData, allPandalsData] = await Promise.all([
          getAreas(),
          getAllPandals(),
        ]);
        if (isMounted) {
          setAreas(areasData);
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

  // Curated iconic highlights spanning South, North, and Central Kolkata
  const iconicNames = [
    'Deshapriyo Park',
    'Baghbazar',
    'Kumartuli Park',
    'College Square',
    'Tridhara Sammilani',
    'Suruchi Sangha',
    'Md. Ali Park',
  ];
  const highlightedPandals = displayPandals
    .filter((p) => iconicNames.some((name) => p.name.toLowerCase().includes(name.toLowerCase())))
    .slice(0, 4);

  // Fallback to first 4 if filter doesn't match
  const fallbackHighlights =
    highlightedPandals.length > 0 ? highlightedPandals : displayPandals.slice(0, 4);
  highlightedPandals.length > 0 ? highlightedPandals : displayPandals.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section with Authentic Bengali Aesthetic & Festive Backdrop Image */}
      <section className="relative overflow-hidden rounded-3xl border border-ivory-border p-6 sm:p-10 lg:p-14 shadow-warm-md text-white">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-charcoal/30 to-charcoal/55" />

        </div>

        {/* Subtle Alpana Floral Motifs */}
        <div className="absolute -top-16 -right-16 pointer-events-none opacity-25 text-amber-200 z-1">
          <AlpanaCircle size={320} opacity={0.3} />
        </div>
        <div className="absolute -bottom-20 -left-20 pointer-events-none opacity-20 text-amber-300 z-1">
          <AlpanaCircle size={300} opacity={0.25} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
          {/* Bengali Pill Badge */}
          <div className="inline-flex items-center space-x-2 bg-black/45 backdrop-blur-md border border-amber-400/40 px-4 py-1.5 rounded-full shadow-xs">
            <DurgaEyeIcon size={20} />
            <span className="text-xs sm:text-sm font-bengali font-semibold text-amber-300 tracking-wide drop-shadow-xs">
              শারদোৎসব ২০২৫ • পুজোর কলকাতা, আপনার পথে
            </span>
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
                  className="inline-flex items-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-warm-md hover:shadow-warm-lg active:scale-95 transition-all disabled:opacity-60"
                >
                  <MapPin className="w-4 h-4 text-white" />
                  <span>{isLocating ? 'Detecting Location...' : '📍 Use My Location'}</span>
                </button>
                <button
                  onClick={simulateKolkataLocation}
                  className="inline-flex items-center space-x-1.5 bg-black/45 hover:bg-black/65 text-amber-200 border border-amber-400/40 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl backdrop-blur-md shadow-xs transition-all active:scale-95"
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-ivory-border pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-vermilion font-sans">
                Geographic Zones
              </span>
              <span className="text-xs font-bengali text-charcoal-subtle">অঞ্চল অনুসারে পুজো</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
              Explore by Area
            </h2>
          </div>
          <Link
            to="/pandals"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold text-vermilion hover:text-vermilion-dark transition-colors"
          >
            <span>View All {pandals.length > 0 ? `${pandals.length}+` : '110+'} Pandals</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* South Kolkata - Featured Card */}
          <div className="relative group bg-gradient-to-br from-terracotta-50 via-ivory-surface to-ivory-warm rounded-2xl border-2 border-terracotta/40 p-6 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-vermilion text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                  Theme Hub
                </span>
                <span className="text-xs font-bold text-terracotta">{areaCounts[1] || 27}+ Pandals</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal group-hover:text-vermilion transition-colors">
                  South Kolkata
                </h3>
                <p className="text-xs font-bengali text-charcoal-subtle mt-0.5">
                  দক্ষিণ কলকাতা • ঐতিহ্য ও মেগা থিম পুজো
                </p>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Home to Kolkata's most iconic celebrations: Deshapriyo Park, Ballygunge Cultural,
                Tridhara, Suruchi Sangha, and Chetla Agrani.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-terracotta-100">
              <Link
                to="/areas/1/pandals"
                className="w-full inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-warm-sm transition-all"
              >
                <span>Explore South</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* North Kolkata - Active Card */}
          <div className="relative group bg-gradient-to-br from-terracotta-50/50 via-ivory-surface to-ivory-warm rounded-2xl border-2 border-terracotta/30 p-6 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-leaf text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                  Heritage Hub
                </span>
                <span className="text-xs font-bold text-leaf-dark">{areaCounts[2] || 63}+ Pandals</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal group-hover:text-vermilion transition-colors">
                  North Kolkata
                </h3>
                <p className="text-xs font-bengali text-charcoal-subtle mt-0.5">
                  উত্তর কলকাতা • বনেদি বাড়ির সাবেকিয়ানা
                </p>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Centuries-old heritage pujas and clay artisans: Baghbazar Sarbojanin, Kumartuli Park,
                Sovabazar, Hatkhola, and Jagat Mukherjee Park.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-ivory-muted">
              <Link
                to="/areas/2/pandals"
                className="w-full inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-warm-sm transition-all"
              >
                <span>Explore North</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Central Kolkata - Active Card */}
          <div className="relative group bg-gradient-to-br from-amber-50/50 via-ivory-surface to-ivory-warm rounded-2xl border-2 border-amber-300/40 p-6 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-brass text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                  Grand Lighting
                </span>
                <span className="text-xs font-bold text-brass-dark">{areaCounts[3] || 23}+ Pandals</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal group-hover:text-vermilion transition-colors">
                  Central Kolkata
                </h3>
                <p className="text-xs font-bengali text-charcoal-subtle mt-0.5">
                  মধ্য কলকাতা • প্রাণকেন্দ্র ও আলোকসজ্জা
                </p>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Heart of the city famous for lake reflections and architectural replicas: College Square,
                Md. Ali Park, and Santosh Mitra Square.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-ivory-muted">
              <Link
                to="/areas/3/pandals"
                className="w-full inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-warm-sm transition-all"
              >
                <span>Explore Central</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* East Kolkata */}
          <div className="bg-ivory-surface rounded-2xl border border-ivory-border p-6 shadow-warm-sm flex flex-col justify-between opacity-95">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-stone-100 text-charcoal-muted text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-stone-200">
                  Salt Lake & Bypass
                </span>
                <span className="text-[10px] font-semibold text-brass">Coming Soon</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal">East Kolkata</h3>
                <p className="text-xs font-bengali text-charcoal-subtle mt-0.5">
                  পূর্ব কলকাতা • সল্টলেক ও ইএম বাইপাস
                </p>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Green Line East-West metro corridor connecting Salt Lake FD Block, BJ Block, and
                Sreebhumi Sporting Club.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-ivory-muted">
              <Link
                to="/metro/lines/Green%20Line"
                className="w-full inline-flex items-center justify-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-charcoal text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors"
              >
                <span>Green Line Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Highlights Grid / Carousel */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-ivory-border pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                Iconic Highlights
              </span>
              <span className="text-xs font-bengali text-charcoal-subtle">কলকাতা জুড়ে সেরা আকর্ষণ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
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
      <section className="relative overflow-hidden bg-gradient-to-r from-charcoal via-stone-900 to-charcoal rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
              <Train className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kolkata Metro Network</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-400">Green, Blue, Purple & Orange Lines</span>
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
              to="/metro"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <Train className="w-4 h-4" />
              <span>Explore Metro Lines</span>
            </Link>
            <Link
              to="/nearby"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 transition-colors"
            >
              <MapPin className="w-4 h-4 text-vermilion-light" />
              <span>Find Closest Puja</span>
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

