import React, { useState, useEffect, useMemo } from 'react';
import { useRoutePlanner, DEFAULT_PRESET_CIRCUIT } from '../context/RouteContext';
import { PandalResponseDTO } from '../types/api';
import { getAllPandals } from '../services/areaService';
import { RouteSummaryCard } from '../components/routes/RouteSummaryCard';
import { RouteTimelineLeg } from '../components/routes/RouteTimelineLeg';
import { Search, Train, Sparkles, RefreshCw, Check, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export const RoutePlanner: React.FC = () => {
  const {
    selectedPandalIds,
    togglePandalSelection,
    clearSelection,
    setSelectedPandalIds,
    routeResult,
    isLoadingRoute,
    routeError,
    calculateRoute,
  } = useRoutePlanner();

  const [allPandals, setAllPandals] = useState<PandalResponseDTO[]>([]);
  const [loadingPandals, setLoadingPandals] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAreaFilter, setActiveAreaFilter] = useState<string>('all');
  const [mobileTab, setMobileTab] = useState<'select' | 'route'>('select');

  // Load all pandals across Kolkata
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoadingPandals(true);
        const data = await getAllPandals();
        if (isMounted) setAllPandals(data);
      } catch (e) {
        console.error('Failed to load pandals for route planner', e);
      } finally {
        if (isMounted) setLoadingPandals(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pre-calculate route on mount if default IDs exist and no routeResult yet
  useEffect(() => {
    if (!routeResult && selectedPandalIds.length > 0) {
      calculateRoute(selectedPandalIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Presets definition
  const presets = [
    {
      id: 'popular_south',
      label: 'South Kolkata Heritage',
      bengali: 'দক্ষিণ কলকাতা ঐতিহ্য',
      pandalIds: [10, 11, 12, 19],
      badge: 'Popular',
    },
    {
      id: 'rasbehari_loop',
      label: 'Rasbehari & Kalighat Loop',
      bengali: 'রাসবিহারী-কালীঘাট সার্কিট',
      pandalIds: [1, 4, 8, 13, 20],
      badge: '5 Pandals',
    },
    {
      id: 'gariahat_classics',
      label: 'Gariahat-Ballygunge Classics',
      bengali: 'গড়িয়াহাট ক্লাসিক্স',
      pandalIds: [2, 5, 6, 7],
      badge: 'Walking Loop',
    },
  ];

  // Distinct areas for filter
  const areas = useMemo(() => {
    const set = new Set<string>();
    allPandals.forEach((p) => {
      if (p.areaName) set.add(p.areaName);
    });
    return Array.from(set);
  }, [allPandals]);

  // Filtered pandals in selector
  const filteredPandals = useMemo(() => {
    return allPandals.filter((pandal) => {
      const matchesSearch =
        !searchQuery.trim() ||
        pandal.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        pandal.address.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (pandal.nearbyMetroStationName &&
          pandal.nearbyMetroStationName.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchesArea =
        activeAreaFilter === 'all' || pandal.areaName === activeAreaFilter;

      return matchesSearch && matchesArea;
    });
  }, [allPandals, searchQuery, activeAreaFilter]);

  // Selected pandal objects
  const selectedPandalObjects = useMemo(() => {
    const idMap = new Map<number, PandalResponseDTO>();
    allPandals.forEach((p) => idMap.set(p.id, p));
    return selectedPandalIds.map((id) => idMap.get(id)).filter(Boolean) as PandalResponseDTO[];
  }, [allPandals, selectedPandalIds]);

  const handleApplyPreset = (ids: number[]) => {
    setSelectedPandalIds(ids);
    calculateRoute(ids);
    if (window.innerWidth < 1024) {
      setMobileTab('route');
    }
  };

  const handleBuildRoute = async () => {
    await calculateRoute();
    if (window.innerWidth < 1024) {
      setMobileTab('route');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-vermilion-deep via-vermilion to-terracotta text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-warm-lg overflow-hidden">
        {/* Background decorative festive glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold">
            <Train className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bengali">মেট্রো পরিক্রমা রুট প্ল্যানার</span>
            <span className="text-white/60">|</span>
            <span>Metro-Optimized Routes</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Plan Your Durga Puja Parikrama
          </h1>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            Select pandals across Kolkata. Our route optimizer finds the fastest parikrama circuit,
            seamlessly coordinating walking legs with nearest Kolkata Metro stations to bypass traffic.
          </p>
        </div>
      </section>

      {/* Preset Circuits Bar */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle dark:text-stone-400">
            Quick Preset Circuits
          </h2>
          <span className="text-[11px] text-terracotta dark:text-amber-400 font-medium">
            1-Click Route
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset.pandalIds)}
              className="p-4 rounded-2xl bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 hover:border-vermilion/50 dark:hover:border-amber-400/40 text-left shadow-xs hover:shadow-warm-sm transition-[colors,box-shadow] group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bengali font-bold text-vermilion dark:text-amber-300">
                  {preset.bengali}
                </span>
                <span className="text-[10px] bg-vermilion/10 dark:bg-vermilion/20 text-vermilion dark:text-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  {preset.badge}
                </span>
              </div>
              <p className="text-xs font-bold text-charcoal dark:text-stone-100 group-hover:text-vermilion transition-colors">
                {preset.label}
              </p>
              <p className="text-[11px] text-charcoal-subtle dark:text-stone-400 mt-1">
                {preset.pandalIds.length} stops via Kolkata Metro
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Mobile Tab Switcher (Visible on < lg screens) */}
      <div className="lg:hidden flex items-center bg-ivory-warm dark:bg-obsidian-100 p-1 rounded-2xl border border-ivory-border dark:border-obsidian-300">
        <button
          type="button"
          onClick={() => setMobileTab('select')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5',
            mobileTab === 'select'
              ? 'bg-vermilion text-white shadow-warm-xs'
              : 'text-charcoal-soft dark:text-stone-300 hover:text-charcoal'
          )}
        >
          <span>Select Pandals</span>
          <span className="bg-black/20 text-white px-2 py-0.5 rounded-full text-[10px]">
            {selectedPandalIds.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('route')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5',
            mobileTab === 'route'
              ? 'bg-vermilion text-white shadow-warm-xs'
              : 'text-charcoal-soft dark:text-stone-300 hover:text-charcoal'
          )}
        >
          <Train className="w-3.5 h-3.5" />
          <span>View Route</span>
          {routeResult && (
            <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px]">
              Ready
            </span>
          )}
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Pandal Picker (Hidden on mobile if viewing route tab) */}
        <div
          className={cn(
            'lg:col-span-5 space-y-4',
            mobileTab === 'route' ? 'hidden lg:block' : 'block'
          )}
        >
          <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-5 shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-charcoal dark:text-stone-100">
                  Select Pandals
                </h3>
                <p className="text-xs text-charcoal-subtle dark:text-stone-400">
                  Choose the pujas you wish to visit
                </p>
              </div>

              {selectedPandalIds.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="inline-flex items-center space-x-1 text-xs text-red-500 hover:text-red-700 font-semibold p-1 transition-colors"
                  title="Clear all selected"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear ({selectedPandalIds.length})</span>
                </button>
              )}
            </div>

            {/* Selected Pandal Chips preview */}
            {selectedPandalObjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-ivory-warm/60 dark:bg-obsidian-100/70 border border-ivory-border dark:border-obsidian-300 max-h-32 overflow-y-auto">
                {selectedPandalObjects.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center space-x-1 text-xs bg-vermilion/10 dark:bg-vermilion/20 text-vermilion-dark dark:text-vermilion-light border border-vermilion/25 px-2.5 py-1 rounded-lg font-medium"
                  >
                    <span className="line-clamp-1 max-w-[140px]">{p.name}</span>
                    <button
                      type="button"
                      onClick={() => togglePandalSelection(p.id)}
                      className="hover:text-red-600 transition-colors ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-subtle dark:text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by pandal or metro station..."
                className="w-full pl-10 pr-4 py-2 bg-ivory-warm dark:bg-obsidian-100 border border-ivory-border dark:border-obsidian-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-colors text-charcoal dark:text-stone-100 placeholder:text-charcoal-subtle dark:placeholder:text-stone-400 shadow-2xs"
              />
            </div>

            {/* Area Filter Chips */}
            {areas.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveAreaFilter('all')}
                  className={cn(
                    'px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors shrink-0',
                    activeAreaFilter === 'all'
                      ? 'bg-charcoal text-white dark:bg-stone-200 dark:text-charcoal'
                      : 'bg-ivory-warm dark:bg-obsidian-100 text-charcoal-subtle dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-obsidian-200'
                  )}
                >
                  All ({allPandals.length})
                </button>
                {areas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setActiveAreaFilter(area)}
                    className={cn(
                      'px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors shrink-0',
                      activeAreaFilter === area
                        ? 'bg-charcoal text-white dark:bg-stone-200 dark:text-charcoal'
                        : 'bg-ivory-warm dark:bg-obsidian-100 text-charcoal-subtle dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-obsidian-200'
                    )}
                  >
                    {area}
                  </button>
                ))}
              </div>
            )}

            {/* Pandals Checklist */}
            <div className="max-h-[380px] sm:max-h-[440px] overflow-y-auto space-y-2 pr-1">
              {loadingPandals ? (
                <div className="py-8 text-center text-xs text-charcoal-subtle dark:text-stone-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-vermilion" />
                  Loading pandal catalog...
                </div>
              ) : filteredPandals.length === 0 ? (
                <div className="py-8 text-center text-xs text-charcoal-subtle dark:text-stone-400">
                  No pandals found matching "{searchQuery}"
                </div>
              ) : (
                filteredPandals.map((pandal) => {
                  const isSelected = selectedPandalIds.includes(pandal.id);
                  return (
                    <div
                      key={pandal.id}
                      onClick={() => togglePandalSelection(pandal.id)}
                      className={cn(
                        'p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-[colors,box-shadow]',
                        isSelected
                          ? 'bg-vermilion/5 dark:bg-vermilion/15 border-vermilion/40 dark:border-vermilion/50 shadow-2xs'
                          : 'bg-ivory-warm/60 dark:bg-obsidian-100/50 border-ivory-border dark:border-obsidian-300 hover:border-terracotta/40'
                      )}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={cn(
                            'w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors',
                            isSelected
                              ? 'bg-vermilion border-vermilion text-white'
                              : 'border-charcoal-subtle/30 dark:border-stone-500 bg-white dark:bg-obsidian-50'
                          )}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-charcoal dark:text-stone-100 truncate">
                            {pandal.name}
                          </p>
                          <div className="flex items-center space-x-1.5 text-[11px] text-charcoal-subtle dark:text-stone-400 truncate">
                            <span>{pandal.areaName}</span>
                            {pandal.nearbyMetroStationName && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                  🚇 {pandal.nearbyMetroStationName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 transition-colors',
                          isSelected
                            ? 'text-vermilion dark:text-vermilion-light'
                            : 'text-charcoal-subtle dark:text-stone-400'
                        )}
                      >
                        {isSelected ? 'Added' : '+ Add'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Build Route CTA Button */}
            <button
              type="button"
              disabled={selectedPandalIds.length === 0 || isLoadingRoute}
              onClick={handleBuildRoute}
              className="w-full inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark disabled:opacity-50 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-warm-md hover:shadow-warm-lg transition-[colors,box-shadow] active:scale-98 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoadingRoute ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calculating Metro-Optimized Route...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    Build Metro Route ({selectedPandalIds.length} {selectedPandalIds.length === 1 ? 'Pandal' : 'Pandals'})
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Route Itinerary (Hidden on mobile if viewing select tab) */}
        <div
          className={cn(
            'lg:col-span-7 space-y-6',
            mobileTab === 'select' ? 'hidden lg:block' : 'block'
          )}
        >
          {isLoadingRoute ? (
            <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-12 text-center space-y-4 shadow-warm-sm">
              <RefreshCw className="w-10 h-10 animate-spin text-vermilion mx-auto" />
              <h3 className="text-lg font-bold text-charcoal dark:text-stone-100">
                Optimizing Your Parikrama Route
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-subtle dark:text-stone-400 max-w-md mx-auto">
                Evaluating walking distances, metro line connections, and sequencing stops for minimum travel time...
              </p>
            </div>
          ) : routeError ? (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center space-y-3">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">{routeError}</p>
              <button
                type="button"
                onClick={() => calculateRoute()}
                className="inline-flex items-center space-x-1.5 bg-vermilion text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-vermilion-dark transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Route</span>
              </button>
            </div>
          ) : routeResult && routeResult.route.length > 0 ? (
            <div className="space-y-6">
              {/* Summary Stats Card */}
              <RouteSummaryCard routeResult={routeResult} />

              {/* Step-by-Step Timeline */}
              <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-5 sm:p-7 shadow-warm-sm space-y-2">
                <div className="flex items-center justify-between pb-4 border-b border-ivory-muted dark:border-obsidian-300 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-charcoal dark:text-stone-100">
                      Turn-by-Turn Parikrama Itinerary
                    </h3>
                    <p className="text-xs text-charcoal-subtle dark:text-stone-400">
                      Follow this order for the easiest journey via metro and walking
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-lg">
                    {routeResult.route.length} Steps
                  </span>
                </div>

                <div className="space-y-0">
                  {routeResult.route.map((leg, index) => (
                    <RouteTimelineLeg
                      key={`${leg.type}-${leg.name}-${index}`}
                      leg={leg}
                      index={index}
                      isLast={index === routeResult.route.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-10 sm:p-14 text-center space-y-4 shadow-warm-sm">
              <div className="w-16 h-16 rounded-2xl bg-vermilion/10 dark:bg-vermilion/20 flex items-center justify-center mx-auto text-vermilion">
                <Train className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-charcoal dark:text-stone-100">
                No Route Built Yet
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-subtle dark:text-stone-400 max-w-md mx-auto">
                Pick pandals from the left checklist or select a quick preset circuit above, then click
                "Build Metro Route" to generate your turn-by-turn parikrama itinerary.
              </p>
              <button
                type="button"
                onClick={() => handleApplyPreset(DEFAULT_PRESET_CIRCUIT)}
                className="inline-flex items-center space-x-2 bg-vermilion text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-vermilion-dark transition-colors shadow-warm-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Load South Kolkata Heritage Loop</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
