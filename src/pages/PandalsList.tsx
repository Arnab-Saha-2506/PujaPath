import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaResponseDTO, PandalResponseDTO } from '../types/api';
import { getAreas, getPandalsByArea } from '../services/areaService';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';
import { PandalCard } from '../components/pandals/PandalCard';
import { PandalGridSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { AlpanaCircle } from '../components/common/AlpanaMotif';
import { Search, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

export const PandalsList: React.FC = () => {
  const { areaId } = useParams<{ areaId?: string }>();
  const navigate = useNavigate();
  const selectedAreaId = areaId ? parseInt(areaId, 10) : 1; // Default to South Kolkata (1)

  const { latitude, longitude, status } = useGeolocation();

  const [areas, setAreas] = useState<AreaResponseDTO[]>([]);
  const [pandals, setPandals] = useState<PandalResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'distance' | 'name'>('default');

  // Load areas on mount
  useEffect(() => {
    async function loadAreas() {
      try {
        const areaList = await getAreas();
        setAreas(areaList);
      } catch (e) {
        console.error('Failed to load areas', e);
      }
    }
    loadAreas();
  }, []);

  // Load pandals when selectedAreaId changes
  useEffect(() => {
    let isMounted = true;
    async function loadPandals() {
      try {
        setLoading(true);
        const data = await getPandalsByArea(selectedAreaId);
        if (isMounted) {
          setPandals(data);
        }
      } catch (err) {
        console.error('Failed to load pandals for area', selectedAreaId, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPandals();
    return () => {
      isMounted = false;
    };
  }, [selectedAreaId]);

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

  // Filter & sort
  const filteredPandals = useMemo(() => {
    let result = enrichedPandals.filter((pandal) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        pandal.name.toLowerCase().includes(q) ||
        pandal.address.toLowerCase().includes(q) ||
        (pandal.description && pandal.description.toLowerCase().includes(q))
      );
    });

    if (sortBy === 'distance' && latitude !== null && longitude !== null) {
      result = [...result].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [enrichedPandals, searchQuery, sortBy, latitude, longitude]);

  const handleTabChange = (id: number) => {
    if (id === 1) {
      navigate('/pandals');
    } else {
      navigate(`/areas/${id}/pandals`);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-ivory-surface rounded-2xl border border-ivory-border p-6 sm:p-8 shadow-warm-sm">
        <div className="absolute -top-12 -right-12 pointer-events-none opacity-20">
          <AlpanaCircle size={220} opacity={0.2} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-vermilion">
              Durga Puja Directory
            </span>
            <span className="text-xs text-charcoal-subtle">•</span>
            <span className="text-xs font-bengali text-charcoal-muted">কলকাতার সেরা পুজো</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Kolkata Puja Pandals
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Explore famous heritage & community pandals across Kolkata. Check live walking
            distances, nearest metro connections, and best visiting times.
          </p>
        </div>

        {/* Area Tabs */}
        <div className="mt-6 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-ivory-muted">
          {areas.map((area) => {
            const isSelected = selectedAreaId === area.id;
            return (
              <button
                key={area.id}
                onClick={() => handleTabChange(area.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2',
                  isSelected
                    ? 'bg-vermilion text-white shadow-warm-sm'
                    : 'bg-ivory-warm text-charcoal-soft hover:bg-stone-200/70'
                )}
              >
                <span>{area.name}</span>
                {area.id === 1 ? (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                      isSelected ? 'bg-white/20 text-white' : 'bg-vermilion/10 text-vermilion'
                    )}
                  >
                    27+
                  </span>
                ) : area.id === 2 ? (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                      isSelected ? 'bg-white/20 text-white' : 'bg-leaf/15 text-leaf-dark'
                    )}
                  >
                    63+
                  </span>
                ) : area.id === 3 ? (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                      isSelected ? 'bg-white/20 text-white' : 'bg-brass/15 text-brass-dark'
                    )}
                  >
                    23+
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-stone-100 text-charcoal-subtle">
                    Soon
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
          <Search className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pandals by name, street, or theme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-ivory-surface border border-ivory-border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-subtle hover:text-charcoal"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-charcoal-subtle flex items-center space-x-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-ivory-surface border border-ivory-border rounded-xl text-xs font-semibold px-3 py-2 text-charcoal focus:outline-hidden focus:ring-2 focus:ring-vermilion/30 shadow-xs"
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
          actionText={searchQuery ? 'Clear Search' : 'View South Kolkata'}
          onAction={() => {
            if (searchQuery) setSearchQuery('');
            else navigate('/pandals');
          }}
        />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4 text-xs text-charcoal-subtle">
            <span>
              Showing <strong className="text-charcoal">{filteredPandals.length}</strong> pandals
              in {areas.find((a) => a.id === selectedAreaId)?.name || 'Kolkata'}
            </span>
            {status === 'granted' && (
              <span className="text-leaf font-medium flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Distances calculated from your live coordinates</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPandals.map((pandal) => (
              <PandalCard key={pandal.id} pandal={pandal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

