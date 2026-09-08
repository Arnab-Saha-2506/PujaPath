import { MOCK_METRO_STATIONS } from '../services/mockData';
import { calculateHaversineDistance, estimateWalkingTime } from './distance';

export interface NearestMetroResult {
  id: number;
  name: string;
  line: string;
  distanceKm: number;
  walkingTimeMinutes: number;
}

// Flatten all unique metro stations across lines once
const ALL_STATIONS = Object.values(MOCK_METRO_STATIONS).flat();

// Memory cache to avoid recalculations across card renders
const cache = new Map<string, NearestMetroResult>();

export function getNearestMetroStation(
  latitude: number | undefined | null,
  longitude: number | undefined | null
): NearestMetroResult | null {
  if (latitude == null || longitude == null) return null;

  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const cached = cache.get(key);
  if (cached) return cached;

  let closest: NearestMetroResult | null = null;
  let minDist = Infinity;

  for (const station of ALL_STATIONS) {
    const dist = calculateHaversineDistance(
      latitude,
      longitude,
      station.latitude,
      station.longitude
    );
    if (dist < minDist) {
      minDist = dist;
      closest = {
        id: station.id,
        name: station.name,
        line: station.line,
        distanceKm: dist,
        walkingTimeMinutes: estimateWalkingTime(dist),
      };
    }
  }

  if (closest) {
    cache.set(key, closest);
  }

  return closest;
}
