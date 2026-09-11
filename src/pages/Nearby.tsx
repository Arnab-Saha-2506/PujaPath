import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NearbyPandalDTO, NearbyPlaceDTO, NearbyPlaceType } from '../types/api';
import { getNearbyPandals, getNearbyPlaces } from '../services/nearbyService';
import { useGeolocation } from '../hooks/useGeolocation';
import { NearbyMap, MapItem } from '../components/nearby/NearbyMap';
import { AlpanaCircle } from '../components/common/AlpanaMotif';
import { DurgaEyeIcon } from '../components/common/DurgaEyeIcon';
import {
  MapPin,
  RefreshCw,
  Sparkles,
  Navigation,
  SlidersHorizontal,
  Search,
  ExternalLink,
  ArrowRight,
  Shield,
  CreditCard,
  Building2,
  Coffee,
  Pill,
  Layers,
  Crosshair,
  UtensilsCrossed,
  Bath,
} from 'lucide-react';
import { openNavigation } from '../utils/navigation';

type FilterCategory = 'all' | 'pandal' | NearbyPlaceType;

interface FilterTab {
  id: FilterCategory;
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  badgeBg: string;
}

const FILTER_TABS: FilterTab[] = [
  {
    id: 'all',
    label: 'All Nearby',
    icon: <Layers className="w-3.5 h-3.5" />,
    colorClass: 'text-charcoal dark:text-stone-200',
    badgeBg: 'bg-stone-200 dark:bg-stone-700',
  },
  {
    id: 'pandal',
    label: 'Pandals',
    icon: <Sparkles className="w-3.5 h-3.5 text-vermilion" />,
    colorClass: 'text-vermilion dark:text-vermilion-light',
    badgeBg: 'bg-vermilion/10 text-vermilion dark:bg-vermilion/20',
  },
  {
    id: 'police',
    label: 'Police',
    icon: <Shield className="w-3.5 h-3.5 text-blue-600" />,
    colorClass: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  },
  {
    id: 'atm',
    label: 'ATMs',
    icon: <CreditCard className="w-3.5 h-3.5 text-emerald-600" />,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  {
    id: 'hospital',
    label: 'Hospitals',
    icon: <Building2 className="w-3.5 h-3.5 text-rose-600" />,
    colorClass: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacies',
    icon: <Pill className="w-3.5 h-3.5 text-violet-600" />,
    colorClass: 'text-violet-600 dark:text-violet-400',
    badgeBg: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  },
  {
    id: 'restaurant',
    label: 'Restaurants',
    icon: <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />,
    colorClass: 'text-orange-600 dark:text-orange-400',
    badgeBg: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
  },
  {
    id: 'cafe',
    label: 'Cafes',
    icon: <Coffee className="w-3.5 h-3.5 text-amber-600" />,
    colorClass: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  },
  {
    id: 'toilet',
    label: 'Toilets',
    icon: <Bath className="w-3.5 h-3.5 text-teal-600" />,
    colorClass: 'text-teal-600 dark:text-teal-400',
    badgeBg: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
  },
];

const CATEGORY_META: Record<
  string,
  { label: string; icon: React.ReactNode; badgeClass: string }
> = {
  pandal: {
    label: 'Durga Pandal',
    icon: <Sparkles className="w-3.5 h-3.5 text-vermilion" />,
    badgeClass: 'bg-vermilion/10 text-vermilion dark:bg-vermilion/20',
  },
  police: {
    label: 'Police Station',
    icon: <Shield className="w-3.5 h-3.5 text-blue-600" />,
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  },
  atm: {
    label: 'ATM',
    icon: <CreditCard className="w-3.5 h-3.5 text-emerald-600" />,
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  hospital: {
    label: 'Hospital',
    icon: <Building2 className="w-3.5 h-3.5 text-rose-600" />,
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
  },
  pharmacy: {
    label: 'Pharmacy',
    icon: <Pill className="w-3.5 h-3.5 text-violet-600" />,
    badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  },
  cafe: {
    label: 'Cafe',
    icon: <Coffee className="w-3.5 h-3.5 text-amber-600" />,
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  },
  restaurant: {
    label: 'Restaurant',
    icon: <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />,
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
  },
  toilet: {
    label: 'Public Toilet',
    icon: <Bath className="w-3.5 h-3.5 text-teal-600" />,
    badgeClass: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
  },
};

export const Nearby: React.FC = () => {
  const {
    latitude,
    longitude,
    status,
    isLocating,
    error: geoError,
    requestLocation,
    refreshLocation,
    simulateKolkataLocation,
  } = useGeolocation();

  const navigate = useNavigate();

  // Selected filters and controls
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [radiusKm, setRadiusKm] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);

  // Data states
  const [pandals, setPandals] = useState<NearbyPandalDTO[]>([]);
  const [placesByType, setPlacesByType] = useState<Record<NearbyPlaceType, NearbyPlaceDTO[]>>({
    police: [],
    atm: [],
    hospital: [],
    cafe: [],
    pharmacy: [],
    restaurant: [],
    toilet: [],
  });

  // Loading states
  const [loadingPandals, setLoadingPandals] = useState<boolean>(false);
  const [loadingPlaces, setLoadingPlaces] = useState<Record<NearbyPlaceType, boolean>>({
    police: false,
    atm: false,
    hospital: false,
    cafe: false,
    pharmacy: false,
    restaurant: false,
    toilet: false,
  });

  // Request location on idle
  useEffect(() => {
    if (status === 'idle') {
      requestLocation();
    }
  }, [status, requestLocation]);

  // Fetch nearby pandals when coordinates or radius changes
  useEffect(() => {
    if (latitude === null || longitude === null) return;

    let isMounted = true;
    async function loadPandals() {
      try {
        setLoadingPandals(true);
        const data = await getNearbyPandals(latitude!, longitude!, radiusKm);
        if (isMounted) {
          setPandals(data);
        }
      } catch (err) {
        console.error('Failed to load nearby pandals:', err);
      } finally {
        if (isMounted) setLoadingPandals(false);
      }
    }

    loadPandals();
    return () => {
      isMounted = false;
    };
  }, [latitude, longitude, radiusKm]);

  // Load nearby places for a given type
  const fetchPlaces = useCallback(
    async (type: NearbyPlaceType) => {
      if (latitude === null || longitude === null) return;
      try {
        setLoadingPlaces((prev) => ({ ...prev, [type]: true }));
        const data = await getNearbyPlaces(type, latitude, longitude, radiusKm);
        setPlacesByType((prev) => ({ ...prev, [type]: data }));
      } catch (err) {
        console.error(`Failed to load places for ${type}:`, err);
      } finally {
        setLoadingPlaces((prev) => ({ ...prev, [type]: false }));
      }
    },
    [latitude, longitude, radiusKm]
  );

  // Fetch places when category is selected or on initial grant
  useEffect(() => {
    if (latitude === null || longitude === null) return;

    if (activeCategory === 'all') {
      // Pre-fetch all categories for instant switching
      (['police', 'atm', 'hospital', 'pharmacy', 'restaurant', 'cafe', 'toilet'] as NearbyPlaceType[]).forEach((type) => {
        fetchPlaces(type);
      });
    } else if (activeCategory !== 'pandal') {
      fetchPlaces(activeCategory);
    }
  }, [activeCategory, latitude, longitude, radiusKm, fetchPlaces]);

  // Transform into unified MapItem list
  const allMapItems = useMemo<MapItem[]>(() => {
    const items: MapItem[] = [];

    pandals.forEach((p) => {
      items.push({
        id: `pandal_${p.id}`,
        itemType: 'pandal',
        name: p.name,
        latitude: p.latitude,
        longitude: p.longitude,
        distanceInKm: p.distanceInKm,
        walkingTimeMinutes: p.walkingTimeMinutes,
        nearbyMetroName: p.nearbyMetroName,
        originalPandal: p,
      });
    });

    Object.entries(placesByType).forEach(([type, placeList]) => {
      placeList.forEach((place) => {
        items.push({
          id: `place_${place.placeId}`,
          itemType: type as NearbyPlaceType,
          name: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
          distanceInKm: place.distanceInKm,
          walkingTimeMinutes: place.walkingTimeMinutes,
          address: place.address,
          originalPlace: place,
        });
      });
    });

    return items;
  }, [pandals, placesByType]);

  // Filter and sort items according to category and search query for map display
  const filteredItems = useMemo(() => {
    let result = allMapItems;

    if (activeCategory !== 'all') {
      result = result.filter((item) => item.itemType === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }

    return result.sort((a, b) => a.distanceInKm - b.distanceInKm);
  }, [allMapItems, activeCategory, searchQuery]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allMapItems.length,
      pandal: pandals.length,
      police: placesByType.police.length,
      atm: placesByType.atm.length,
      hospital: placesByType.hospital.length,
      pharmacy: placesByType.pharmacy.length,
      restaurant: placesByType.restaurant.length,
      cafe: placesByType.cafe.length,
      toilet: placesByType.toilet.length,
    };
    return counts;
  }, [allMapItems.length, pandals.length, placesByType]);

  // Nearest 2 per key category for a neat, uncluttered highlight section
  const nearestEssentials = useMemo(() => {
    const categories: Array<'pandal' | NearbyPlaceType> = [
      'pandal',
      'police',
      'atm',
      'hospital',
      'pharmacy',
      'restaurant',
      'cafe',
      'toilet',
    ];

    const result: Array<{
      category: 'pandal' | NearbyPlaceType;
      items: MapItem[];
    }> = [];

    categories.forEach((cat) => {
      const catItems = allMapItems
        .filter((item) => item.itemType === cat)
        .sort((a, b) => a.distanceInKm - b.distanceInKm)
        .slice(0, 2);

      if (catItems.length > 0) {
        result.push({
          category: cat,
          items: catItems,
        });
      }
    });

    return result;
  }, [allMapItems]);

  const isAnyLoading =
    loadingPandals ||
    Object.values(loadingPlaces).some(Boolean);

  return (
    <div className="space-y-6 pb-20">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-ivory-surface dark:bg-obsidian-50 rounded-3xl border border-ivory-border dark:border-obsidian-300 p-6 sm:p-8 shadow-warm-sm">
        <div className="absolute -top-12 -right-12 pointer-events-none opacity-20">
          <AlpanaCircle size={220} opacity={0.2} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-vermilion">
                Proximity Map
              </span>
              <span className="text-xs text-charcoal-subtle dark:text-stone-500">•</span>
              <span className="text-xs font-bengali text-charcoal-muted dark:text-stone-400">
                শারদ পরিক্রমা ও জরুরি পরিষেবা
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-stone-100 tracking-tight">
              Puja & Places Near You
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-stone-400 leading-relaxed">
              Explore nearby Durga Puja pandals, police stations, ATMs, hospitals, pharmacies, and
              cafes on the interactive map. Tap any marker to view walking times, metro connections, or
              get immediate directions.
            </p>
          </div>

          {/* Quick Demo Button */}
          {status !== 'granted' && (
            <div className="shrink-0">
              <button
                onClick={simulateKolkataLocation}
                className="inline-flex items-center space-x-2 bg-terracotta-50 hover:bg-terracotta-100 dark:bg-obsidian-200 dark:hover:bg-obsidian-300 text-terracotta dark:text-amber-300 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-terracotta-200 dark:border-amber-500/30 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore South Kolkata Demo</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Location Permission Prompt */}
      {status !== 'granted' ? (
        <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-3xl border border-terracotta/30 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-warm-md flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 pointer-events-none opacity-15 text-vermilion">
            <AlpanaCircle size={180} opacity={0.2} />
          </div>

          <div className="w-20 h-20 rounded-3xl bg-terracotta-50 dark:bg-obsidian-100 border-2 border-terracotta/30 p-3 shadow-md flex items-center justify-center mb-4">
            <DurgaEyeIcon size={52} />
          </div>

          <span className="text-xs font-bengali text-vermilion font-bold tracking-wider uppercase mb-1">
            শারদ পরিক্রমা • নিকটবর্তী পুজো ও মানচিত্র
          </span>

          <h3 className="text-xl sm:text-2xl font-bold text-charcoal dark:text-stone-100 mb-2">
            Allow location access to view nearby pandals & places
          </h3>

          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-stone-400 max-w-md mb-6 leading-relaxed">
            {geoError ||
              'We use your browser GPS coordinates to calculate real-time walking distances to pandals, emergency police stations, ATMs, and medical facilities.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <button
              onClick={requestLocation}
              disabled={isLocating}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-warm-md active:scale-95 transition-colors disabled:opacity-60 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>{isLocating ? 'Locating...' : 'Enable Location'}</span>
            </button>

            <button
              onClick={simulateKolkataLocation}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-terracotta-50 hover:bg-terracotta-100 dark:bg-obsidian-200 text-terracotta dark:text-amber-300 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl border border-terracotta-200 dark:border-amber-500/30 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore South Kolkata Demo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Control Bar: Active GPS pill, Radius filter, and Search */}
          <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-4 sm:p-5 shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                  {isAnyLoading && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Updating
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal-muted dark:text-stone-400">
                  Radius: {radiusKm} km from your position
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search map places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-ivory-warm dark:bg-obsidian-100 border border-ivory-border dark:border-obsidian-300 rounded-xl text-charcoal dark:text-stone-200 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-vermilion/30"
                />
              </div>

              {/* Radius Selector */}
              <div className="flex items-center space-x-1.5 bg-ivory-warm dark:bg-obsidian-100 px-3 py-1.5 rounded-xl border border-ivory-border dark:border-obsidian-300 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-charcoal-subtle dark:text-stone-400" />
                <span className="text-charcoal-subtle dark:text-stone-400">Radius:</span>
                <select
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="bg-transparent font-semibold text-charcoal dark:text-stone-200 focus:outline-hidden [&>option]:bg-ivory-surface dark:[&>option]:bg-obsidian-100 dark:[&>option]:text-stone-100 cursor-pointer"
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={3}>3 km</option>
                  <option value={5}>5 km</option>
                </select>
              </div>

              {/* Refresh GPS Button */}
              <button
                onClick={refreshLocation}
                disabled={isLocating}
                title="Refresh GPS Coordinates"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal dark:text-stone-200 hover:text-vermilion bg-ivory-warm dark:bg-obsidian-100 border border-ivory-border dark:border-obsidian-300 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Interactive Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              const count = categoryCounts[tab.id] ?? 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-vermilion text-white border-vermilion shadow-warm-sm scale-[1.02]'
                      : 'bg-ivory-surface dark:bg-obsidian-50 text-stone-700 dark:text-stone-300 border-ivory-border dark:border-obsidian-300 hover:border-vermilion/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/25 text-white' : tab.badgeBg
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Map (Always Light & Colorful OpenStreetMap) */}
          <div className="w-full">
            <NearbyMap
              userLat={latitude}
              userLon={longitude}
              items={filteredItems}
              selectedItemId={selectedItemId}
              onSelectItem={(item) => setSelectedItemId(item ? item.id : null)}
            />
          </div>

          {/* Clean Proximity Essentials Strip (Top 2 nearest per category) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal dark:text-stone-100 flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-vermilion" />
                  <span>Nearest Essentials to You</span>
                </h2>
                <p className="text-xs text-charcoal-muted dark:text-stone-400">
                  Quick access to the closest pandals, police stations, ATMs, and medical facilities
                </p>
              </div>
            </div>

            {nearestEssentials.length === 0 ? (
              <div className="text-center py-8 bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-6">
                <p className="text-xs font-bold text-charcoal dark:text-stone-200">
                  No places found within {radiusKm} km radius.
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Try expanding the search radius above to 5 km.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearestEssentials.map(({ category, items }) => {
                  const meta = CATEGORY_META[category] || CATEGORY_META.pandal;

                  return (
                    <div
                      key={category}
                      className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-4 shadow-warm-xs flex flex-col justify-between"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-obsidian-200 mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-stone-100 dark:bg-obsidian-200">
                            {meta.icon}
                          </div>
                          <span className="text-xs font-bold text-charcoal dark:text-stone-200">
                            {meta.label}s
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-medium">Top 2 closest</span>
                      </div>

                      {/* Top 2 Items */}
                      <div className="space-y-2.5">
                        {items.map((item, idx) => {
                          const isPandal = item.itemType === 'pandal';
                          const isSelected = selectedItemId === item.id;

                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItemId(item.id)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-vermilion bg-vermilion/5 dark:bg-vermilion/10'
                                  : 'border-transparent hover:border-stone-200 dark:hover:border-obsidian-200 bg-ivory-warm/60 dark:bg-obsidian-100/60'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[10px] font-bold text-vermilion bg-vermilion/10 dark:bg-vermilion/20 px-1.5 py-0.2 rounded-sm">
                                      #{idx + 1}
                                    </span>
                                    <h4 className="font-semibold text-xs text-charcoal dark:text-stone-100 truncate">
                                      {item.name}
                                    </h4>
                                  </div>

                                  <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                                    <span className="font-bold text-amber-600 dark:text-amber-400">
                                      📍 {item.distanceInKm.toFixed(2)} km
                                    </span>
                                    <span>•</span>
                                    <span>🚶 ~{item.walkingTimeMinutes} min</span>
                                  </div>

                                  {item.nearbyMetroName && (
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                                      🚇 Metro: {item.nearbyMetroName}
                                    </p>
                                  )}
                                </div>

                                <div className="shrink-0 flex items-center gap-1">
                                  {isPandal ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/pandals/${item.originalPandal?.id}`);
                                      }}
                                      title="View Pandal Details"
                                      className="p-1.5 rounded-lg bg-vermilion text-white hover:bg-vermilion-dark transition-colors cursor-pointer"
                                    >
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openNavigation(item.latitude, item.longitude, item.name);
                                      }}
                                      title="Get Directions"
                                      className="p-1.5 rounded-lg bg-stone-100 dark:bg-obsidian-200 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors cursor-pointer"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
