import apiClient from './api';
import { AreaResponseDTO, PandalResponseDTO } from '../types/api';
import { deduplicatePandalsByDistance } from '../utils/distance';

// In-memory cache & TTL configs
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const AREAS_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let cachedAreas: { data: AreaResponseDTO[]; timestamp: number } | null = null;
let inFlightAreasPromise: Promise<AreaResponseDTO[]> | null = null;

const areaPandalsCache = new Map<number, { data: PandalResponseDTO[]; timestamp: number }>();
const inFlightAreaPandalsPromises = new Map<number, Promise<PandalResponseDTO[]>>();

let cachedAllPandals: { data: PandalResponseDTO[]; timestamp: number } | null = null;
let inFlightAllPandalsPromise: Promise<PandalResponseDTO[]> | null = null;

/**
 * Fetch all areas with in-flight deduplication and memory caching.
 */
export async function getAreas(): Promise<AreaResponseDTO[]> {
  const now = Date.now();
  if (cachedAreas && now - cachedAreas.timestamp < AREAS_CACHE_TTL_MS) {
    return cachedAreas.data;
  }

  if (inFlightAreasPromise) {
    return inFlightAreasPromise;
  }

  inFlightAreasPromise = (async () => {
    try {
      const response = await apiClient.get<AreaResponseDTO[]>('/areas');
      const areas = response.data || [];
      cachedAreas = { data: areas, timestamp: Date.now() };
      return areas;
    } finally {
      inFlightAreasPromise = null;
    }
  })();

  return inFlightAreasPromise;
}

/**
 * Fetch an area by ID.
 */
export async function getAreaById(areaId: number): Promise<AreaResponseDTO> {
  const areas = await getAreas();
  const found = areas.find((a) => a.id === areaId);
  if (found) return found;

  const response = await apiClient.get<AreaResponseDTO>(`/areas/${areaId}`);
  return response.data;
}

/**
 * Fetch pandals for a specific area with caching and in-flight deduplication.
 */
export async function getPandalsByArea(areaId: number): Promise<PandalResponseDTO[]> {
  const now = Date.now();

  // 1. Check direct area cache
  const cached = areaPandalsCache.get(areaId);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // 2. If all pandals are already cached, slice from there
  if (cachedAllPandals && now - cachedAllPandals.timestamp < CACHE_TTL_MS) {
    const matched = cachedAllPandals.data.filter((p) => p.areaId === areaId);
    if (matched.length > 0) {
      areaPandalsCache.set(areaId, { data: matched, timestamp: now });
      return matched;
    }
  }

  // 3. Deduplicate in-flight requests for this area
  const existingPromise = inFlightAreaPandalsPromises.get(areaId);
  if (existingPromise) {
    return existingPromise;
  }

  const promise = (async () => {
    try {
      const response = await apiClient.get<PandalResponseDTO[]>(`/areas/${areaId}/pandals`);
      const deduped = deduplicatePandalsByDistance(response.data || []);
      areaPandalsCache.set(areaId, { data: deduped, timestamp: Date.now() });
      return deduped;
    } finally {
      inFlightAreaPandalsPromises.delete(areaId);
    }
  })();

  inFlightAreaPandalsPromises.set(areaId, promise);
  return promise;
}

/**
 * Fetch all pandals across all areas:
 * - Omits calling non-existent `/pandals` API
 * - Queries each area concurrently using deduplicated area requests
 * - Merges and deduplicates within 50 meters
 * - Deduplicates concurrent calls to prevent multiple waterfall bursts
 */
export async function getAllPandals(): Promise<PandalResponseDTO[]> {
  const now = Date.now();
  if (cachedAllPandals && now - cachedAllPandals.timestamp < CACHE_TTL_MS) {
    return cachedAllPandals.data;
  }

  if (inFlightAllPandalsPromise) {
    return inFlightAllPandalsPromise;
  }

  inFlightAllPandalsPromise = (async () => {
    try {
      const areas = await getAreas();
      if (!areas || areas.length === 0) {
        return [];
      }

      // Fetch all areas concurrently using the cached/deduplicated getPandalsByArea
      const results = await Promise.all(
        areas.map(async (area) => {
          try {
            return await getPandalsByArea(area.id);
          } catch (err) {
            console.warn(`Failed to fetch pandals for area ${area.name} (${area.id})`, err);
            return [];
          }
        })
      );

      const combined = deduplicatePandalsByDistance(results.flat());
      cachedAllPandals = { data: combined, timestamp: Date.now() };

      // Pre-fill individual area cache so switching tabs is instantaneous
      areas.forEach((area) => {
        const areaPandals = combined.filter((p) => p.areaId === area.id);
        areaPandalsCache.set(area.id, { data: areaPandals, timestamp: Date.now() });
      });

      return combined;
    } finally {
      inFlightAllPandalsPromise = null;
    }
  })();

  return inFlightAllPandalsPromise;
}

/**
 * Clear cache if needed (e.g. user manually refreshes)
 */
export function clearPandalCache(): void {
  cachedAreas = null;
  cachedAllPandals = null;
  areaPandalsCache.clear();
}