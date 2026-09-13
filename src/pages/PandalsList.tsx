import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaResponseDTO, PandalResponseDTO } from '../types/api';
import { getAreas, getPandalsByArea, getAllPandals } from '../services/areaService';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';
import { PandalCard } from '../components/pandals/PandalCard';
import { PandalGridSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { AlpanaCircle } from '../components/common/AlpanaMotif';
import { Search, MapPin, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

const ITEMS_PER_PAGE = 20;

function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  pages.push(1);

  if (currentPage > 3) {
    pages.push('...');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push('...');
  }

  pages.push(totalPages);
  return pages;
}

export const PandalsList: React.FC = () => {
  const { areaId } = useParams<{ areaId?: string }>();
  const navigate = useNavigate();

  const isAllSelected = !areaId || areaId === 'all';
  const selectedAreaId = isAllSelected ? null : parseInt(areaId, 10);

  const { latitude, longitude, status } = useGeolocation();

  const [areas, setAreas] = useState<AreaResponseDTO[]>([]);
  const [pandals, setPandals] = useState<PandalResponseDTO[]>([]);
  const [areaCounts, setAreaCounts] = useState<Record<number, number>>({});
  const [totalAllCount, setTotalAllCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'distance' | 'name'>('default');
  const [currentPage, setCurrentPage] = useState(1);

  const listTopRef = useRef<HTMLDivElement>(null);

  // Load areas and overall counts on mount
  useEffect(() => {
    let isMounted = true;
    async function loadInitialMetadata() {
      try {
        const areaList = await getAreas().catch(() => []);
        if (isMounted) {
          setAreas(areaList);
        }

        // Fetch all pandals to populate counts across all area tabs
        const allPandalsData = await getAllPandals().catch(() => []);
        if (isMounted) {
          setTotalAllCount(allPandalsData.length);
          const counts: Record<number, number> = {};
          allPandalsData.forEach((p) => {
            counts[p.areaId] = (counts[p.areaId] || 0) + 1;
          });
          setAreaCounts(counts);
        }
      } catch (e) {
        console.error('Failed to load initial areas or counts', e);
      }
    }
    loadInitialMetadata();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load active tab pandals whenever selected tab/area changes
  useEffect(() => {
    let isMounted = true;
    async function loadActivePandals() {
      try {
        setLoading(true);
        setCurrentPage(1);

        const data = isAllSelected
          ? await getAllPandals()
          : selectedAreaId
          ? await getPandalsByArea(selectedAreaId)
          : [];

        if (isMounted) {
          setPandals(data);
        }
      } catch (err) {
        console.error('Failed to load pandals for area', selectedAreaId, err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadActivePandals();
    return () => {
      isMounted = false;
    };
  }, [isAllSelected, selectedAreaId]);


  // Reset to page 1 whenever search query or sort order changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Compute live distance if GPS is available
  const enrichedPandals = useMemo(() => {
    return pandals.map((pandal) => {
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
  }, [pandals, latitude, longitude]);

  // Filter & sort entire active set
  const filteredPandals = useMemo(() => {
    let result = enrichedPandals.filter((pandal) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        pandal.name.toLowerCase().includes(q) ||
        pandal.address.toLowerCase().includes(q) ||
        (pandal.description && pandal.description.toLowerCase().includes(q)) ||
        (pandal.areaName && pandal.areaName.toLowerCase().includes(q))
      );
    });

    if (sortBy === 'distance' && latitude !== null && longitude !== null) {
      result = [...result].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [enrichedPandals, searchQuery, sortBy, latitude, longitude]);

  // Pagination calculations (20 pandals per page)
  const totalPages = Math.max(1, Math.ceil(filteredPandals.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPandals = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredPandals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPandals, safeCurrentPage]);

  const startItem = filteredPandals.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredPandals.length);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleTabChange = (id: number | 'all') => {
    if (id === 'all') {
      navigate('/pandals');
    } else {
      navigate(`/areas/${id}/pandals`);
    }
  };

  const currentAreaName = isAllSelected
    ? 'All Kolkata'
    : areas.find((a) => a.id === selectedAreaId)?.name || 'Kolkata';

  return (
    <div ref={listTopRef} className="space-y-8 pb-16 scroll-mt-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-ivory-surface dark:bg-obsidian-50 rounded-2xl border border-ivory-border dark:border-obsidian-300 p-6 sm:p-8 shadow-warm-sm">
        <div className="absolute -top-12 -right-12 pointer-events-none opacity-20">
          <AlpanaCircle size={220} opacity={0.2} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-vermilion">
              Durga Puja Directory
            </span>
            <span className="text-xs text-charcoal-subtle dark:text-stone-500">•</span>
            <span className="text-xs font-bengali text-charcoal-muted dark:text-stone-400">কলকাতার সেরা পুজো</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-stone-100 tracking-tight">
            Kolkata Puja Pandals
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-stone-300">
            Explore famous heritage & community pandals across Kolkata. Check live walking
            distances, nearest metro connections, and best visiting times.
          </p>
        </div>

        {/* Filter Tabs: All + Dynamic Areas */}
        <div className="mt-6 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-ivory-muted dark:border-obsidian-300">
          {/* 1. All Filter Tab */}
          <button
            onClick={() => handleTabChange('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-2',
              isAllSelected
                ? 'bg-vermilion text-white shadow-warm-sm'
                : 'bg-ivory-warm dark:bg-obsidian-100 text-charcoal-soft dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-obsidian-200 border border-transparent dark:border-obsidian-300'
            )}
          >
            <Sparkles className={cn('w-3.5 h-3.5', isAllSelected ? 'text-amber-300' : 'text-vermilion')} />
            <span>All Pandals</span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                isAllSelected ? 'bg-white/20 text-white' : 'bg-vermilion/10 text-vermilion dark:text-vermilion-light'
              )}
            >
              {totalAllCount > 0 ? `${totalAllCount}` : 'All'}
            </span>
          </button>

          {/* 2. Dynamic Area Tabs from DB */}
          {areas.map((area) => {
            const isSelected = selectedAreaId === area.id;
            const count = areaCounts[area.id];

            return (
              <button
                key={area.id}
                onClick={() => handleTabChange(area.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-2',
                  isSelected
                    ? 'bg-vermilion text-white shadow-warm-sm'
                    : 'bg-ivory-warm dark:bg-obsidian-100 text-charcoal-soft dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-obsidian-200 border border-transparent dark:border-obsidian-300'
                )}
              >
                <span>{area.name}</span>
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-stone-200 dark:bg-obsidian-200 text-charcoal-soft dark:text-stone-300'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-charcoal-subtle dark:text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isAllSelected
                ? 'Search all pandals by name, area, theme...'
                : `Search in ${currentAreaName}...`
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 rounded-xl text-sm text-charcoal dark:text-stone-100 placeholder:text-charcoal-subtle dark:placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-subtle dark:text-stone-400 hover:text-charcoal dark:hover:text-stone-200 font-medium px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-charcoal-subtle dark:text-stone-400 flex items-center space-x-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-ivory-surface dark:bg-obsidian-100 border border-ivory-border dark:border-obsidian-300 rounded-xl text-xs font-semibold px-3 py-2 text-charcoal dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-vermilion/30 shadow-xs [&>option]:bg-ivory-surface dark:[&>option]:bg-obsidian-100 dark:[&>option]:text-stone-100"
          >
            <option value="default">Default Order</option>
            {status === 'granted' && <option value="distance">Nearest to Me</option>}
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty / Loading State */}
      {loading ? (
        <PandalGridSkeleton count={9} />
      ) : filteredPandals.length === 0 ? (
        <EmptyState
          title="No Pandals Found"
          description={
            searchQuery
              ? `No pandals matched "${searchQuery}". Try a different keyword.`
              : 'Pandals for this region are being curated.'
          }
          actionText={searchQuery ? 'Clear Search' : 'View All Pandals'}
          onAction={() => {
            if (searchQuery) setSearchQuery('');
            else navigate('/pandals');
          }}
        />
      ) : (
        <div>
          {/* Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 text-xs text-charcoal-subtle dark:text-stone-400">
            <span>
              Showing <strong className="text-charcoal dark:text-stone-100">{startItem}–{endItem}</strong> of{' '}
              <strong className="text-charcoal dark:text-stone-100">{filteredPandals.length}</strong> pandals
              in <span className="font-semibold text-charcoal dark:text-stone-200">{currentAreaName}</span>
            </span>

            <div className="flex items-center space-x-3">
              {status === 'granted' && (
                <span className="text-leaf font-medium flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Distances from live GPS</span>
                </span>
              )}

              {totalPages > 1 && (
                <span className="font-medium text-charcoal-soft dark:text-stone-400">
                  Page {safeCurrentPage} of {totalPages}
                </span>
              )}
            </div>
          </div>

          {/* Grid of 20 Pandals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPandals.map((pandal) => (
              <PandalCard key={pandal.id} pandal={pandal} />
            ))}
          </div>

          {/* Pagination Navigation Controls */}
          {totalPages > 1 && (
            <nav
              aria-label="Pandal list pagination"
              className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-ivory-border dark:border-obsidian-300"
            >
              <div className="text-xs text-charcoal-muted dark:text-stone-400">
                Showing <span className="font-bold text-charcoal dark:text-stone-100">{startItem}</span> to{' '}
                <span className="font-bold text-charcoal dark:text-stone-100">{endItem}</span> of{' '}
                <span className="font-bold text-charcoal dark:text-stone-100">{filteredPandals.length}</span> pandals
              </div>

              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  aria-label="Previous page"
                  className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 text-charcoal dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-obsidian-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {getPaginationRange(safeCurrentPage, totalPages).map((page, idx) =>
                  page === '...' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 py-1 text-xs text-charcoal-subtle dark:text-stone-500 select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      type="button"
                      onClick={() => handlePageChange(page as number)}
                      aria-current={safeCurrentPage === page ? 'page' : undefined}
                      className={cn(
                        'w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-[colors,transform] active:scale-95 flex items-center justify-center shadow-xs',
                        safeCurrentPage === page
                          ? 'bg-vermilion text-white shadow-warm-xs'
                          : 'bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 text-charcoal dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-obsidian-100'
                      )}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  aria-label="Next page"
                  className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 text-charcoal dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-obsidian-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};
