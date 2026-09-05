import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PandalResponseDTO, MetroStationResponseDTO } from '../types/api';
import { getPandalsByStation } from '../services/metroService';
import { getMetroLineMeta, parseStationLines } from '../utils/metroColors';
import { calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';
import { PandalCard } from '../components/pandals/PandalCard';
import { PandalGridSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ArrowLeft, Train, MapPin, Footprints, ExternalLink } from 'lucide-react';
import { MOCK_METRO_STATIONS } from '../services/mockData';

export const MetroStationDetail: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const id = parseInt(stationId || '18', 10);

  const [pandals, setPandals] = useState<PandalResponseDTO[]>([]);
  const [stationMeta, setStationMeta] = useState<MetroStationResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Find station info from mock/known stations
  useEffect(() => {
    let found: MetroStationResponseDTO | undefined;
    for (const stations of Object.values(MOCK_METRO_STATIONS)) {
      found = stations.find((s) => s.id === id);
      if (found) break;
    }
    if (found) {
      setStationMeta(found);
    } else {
      setStationMeta({
        id,
        name: `Metro Station #${id}`,
        line: 'Blue Line',
        latitude: 22.516,
        longitude: 88.346,
      });
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getPandalsByStation(id);
        if (isMounted) {
          // If station coordinates are present, calculate distance from station to pandal
          if (stationMeta) {
            const enriched = data.map((p) => {
              if (p.distanceKm == null && stationMeta.latitude && stationMeta.longitude) {
                const dist = calculateHaversineDistance(
                  stationMeta.latitude,
                  stationMeta.longitude,
                  p.latitude,
                  p.longitude
                );
                return {
                  ...p,
                  distanceKm: dist,
                  walkingTimeMinutes: estimateWalkingTime(dist),
                };
              }
              return p;
            });
            setPandals(enriched);
          } else {
            setPandals(data);
          }
        }
      } catch (err) {
        console.error('Failed to load station pandals', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (stationMeta) {
      load();
    }
    return () => {
      isMounted = false;
    };
  }, [id, stationMeta]);

  const lines = stationMeta ? parseStationLines(stationMeta.line) : ['Blue Line'];

  return (
    <div className="max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1520px] mx-auto pb-16 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/metro"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal hover:text-vermilion transition-colors bg-ivory-surface border border-ivory-border px-3.5 py-2 rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Metro Lines</span>
        </Link>
      </div>

      {/* Station Header */}
      <div className="bg-ivory-surface rounded-3xl border border-ivory-border p-6 sm:p-8 shadow-warm-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
                Metro Station Transit Node
              </span>
              <div className="flex items-center space-x-1.5">
                {lines.map((line) => {
                  const m = getMetroLineMeta(line);
                  return (
                    <span
                      key={line}
                      className="text-[10px] text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs"
                      style={{ backgroundColor: m.hex }}
                    >
                      {line}
                    </span>
                  );
                })}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
              {stationMeta?.name || 'Metro Station'}
            </h1>

            {stationMeta && (
              <p className="text-xs sm:text-sm text-charcoal-muted flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-vermilion shrink-0" />
                <span>
                  Coordinates: {stationMeta.latitude.toFixed(4)}° N,{' '}
                  {stationMeta.longitude.toFixed(4)}° E
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {stationMeta && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${stationMeta.latitude},${stationMeta.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal hover:text-vermilion bg-ivory-warm border border-ivory-border px-4 py-2.5 rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Station on Google Maps</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Nearby Pandals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-ivory-border pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal">
              Puja Pandals Near {stationMeta?.name || 'Station'}
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Sorted by walking proximity from this metro station exit.
            </p>
          </div>
          <span className="text-xs font-semibold bg-terracotta-50 text-terracotta px-3 py-1 rounded-full border border-terracotta-200">
            {pandals.length} Pandals Accessible
          </span>
        </div>

        {loading ? (
          <PandalGridSkeleton count={6} />
        ) : pandals.length === 0 ? (
          <EmptyState
            title="No mapped pandals for this station"
            description="We haven't found direct walking pandals mapped to this station yet. Try nearby stations like Kalighat or Jatin Das Park."
            actionText="View South Kolkata Pandals"
            onAction={() => (window.location.href = '/pandals')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pandals.map((pandal) => (
              <PandalCard key={pandal.id} pandal={pandal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

