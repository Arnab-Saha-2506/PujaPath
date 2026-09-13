import apiClient from './api';
import { NearbyPlaceDTO, NearbyPandalDTO, NearbyPlaceType } from '../types/api';

// In-memory cache to ensure zero lag and instant filter switching
const pandalsCache = new Map<string, { timestamp: number; data: NearbyPandalDTO[] }>();
const placesCache = new Map<string, { timestamp: number; data: NearbyPlaceDTO[] }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

function getCacheKey(prefix: string, lat: number, lon: number, radiusKm: number): string {
  return `${prefix}_${lat.toFixed(3)}_${lon.toFixed(3)}_${radiusKm}`;
}

export async function getNearbyPandals(
  lat: number,
  lon: number,
  radiusKm: number = 3
): Promise<NearbyPandalDTO[]> {
  const cacheKey = getCacheKey('pandals', lat, lon, radiusKm);
  const cached = pandalsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await apiClient.get<NearbyPandalDTO[]>('/pandals/nearby', {
      params: { lat, lon, radiusKm },
    });
    const data = response.data || [];
    pandalsCache.set(cacheKey, { timestamp: Date.now(), data });
    return data;
  } catch (error) {
    console.error('Error fetching nearby pandals:', error);
    if (cached) return cached.data;
    throw error;
  }
}

export async function getNearbyPlaces(
  type: NearbyPlaceType,
  lat: number,
  lon: number,
  radiusKm: number = 2
): Promise<NearbyPlaceDTO[]> {
  const cacheKey = getCacheKey(type, lat, lon, radiusKm);
  const cached = placesCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await apiClient.get<NearbyPlaceDTO[]>('/nearby/places', {
      params: { type, lat, lon, radiusKm },
    });
    const rawList = response.data || [];
    const formatted: NearbyPlaceDTO[] = rawList.map((item) => ({
      ...item,
      type,
      name:
        !item.name || item.name === 'Unnamed Place'
          ? `${type.charAt(0).toUpperCase() + type.slice(1)} Point`
          : item.name,
    }));

    placesCache.set(cacheKey, { timestamp: Date.now(), data: formatted });
    return formatted;
  } catch (error) {
    console.error(`Error fetching nearby places for type '${type}':`, error);
    if (cached) return cached.data;
    return [];
  }
}
