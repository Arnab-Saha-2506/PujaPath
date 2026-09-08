import apiClient from './api';
import { RouteResponseDTO, RouteRequestDTO, RouteLegDTO } from '../types/api';
import { MOCK_PANDALS } from './mockData';
import { getNearestMetroStation } from '../utils/nearestMetro';
import { calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';

/**
 * Request an optimized parikrama itinerary from the backend API:
 * POST /api/v1/routes
 * Body: { pandalIds: number[] }
 */
export async function getOptimizedRoute(pandalIds: number[]): Promise<RouteResponseDTO> {
  if (!pandalIds || pandalIds.length === 0) {
    return {
      route: [],
      totalDistanceKm: 0,
      totalWalkingMinutes: 0,
      totalEstimatedMinutes: 0,
    };
  }

  try {
    const payload: RouteRequestDTO = { pandalIds };
    const response = await apiClient.post<RouteResponseDTO>('/routes', payload);
    if (response.data && Array.isArray(response.data.route)) {
      return response.data;
    }
  } catch (error) {
    console.warn('[PujaPath Route] Server route optimization unavailable, using client fallback:', error);
  }

  // Fallback client-side route calculation if server is offline or errors
  return generateClientRouteFallback(pandalIds);
}

/**
 * Client-side fallback generator for offline or error resilience
 */
function generateClientRouteFallback(pandalIds: number[]): RouteResponseDTO {
  const selectedPandals = MOCK_PANDALS.filter((p) => pandalIds.includes(p.id));
  if (selectedPandals.length === 0) {
    return {
      route: [],
      totalDistanceKm: 0,
      totalWalkingMinutes: 0,
      totalEstimatedMinutes: 0,
    };
  }

  const legs: RouteLegDTO[] = [];
  let prevLat: number | null = null;
  let prevLon: number | null = null;
  let totalKm = 0;
  let totalMinutes = 0;

  selectedPandals.forEach((pandal, index) => {
    // Determine closest metro station for the pandal
    const metro = getNearestMetroStation(pandal.latitude, pandal.longitude);

    // If first stop, add starting metro station leg
    if (index === 0 && metro) {
      legs.push({
        type: 'METRO',
        name: metro.name,
        metroLine: metro.line,
        distanceFromPrevKm: 0,
        walkingMinutes: 0,
        latitude: pandal.latitude - 0.005,
        longitude: pandal.longitude - 0.002,
      });
      prevLat = pandal.latitude - 0.005;
      prevLon = pandal.longitude - 0.002;
    }

    const dist =
      prevLat !== null && prevLon !== null
        ? calculateHaversineDistance(prevLat, prevLon, pandal.latitude, pandal.longitude)
        : 1.2;
    const walkMins = estimateWalkingTime(dist);

    totalKm += dist;
    totalMinutes += walkMins;

    legs.push({
      type: 'PUJA',
      name: pandal.name,
      metroLine: null,
      distanceFromPrevKm: Number(dist.toFixed(2)),
      walkingMinutes: walkMins,
      latitude: pandal.latitude,
      longitude: pandal.longitude,
    });

    prevLat = pandal.latitude;
    prevLon = pandal.longitude;
  });

  return {
    route: legs,
    totalDistanceKm: Number(totalKm.toFixed(2)),
    totalWalkingMinutes: totalMinutes,
    totalEstimatedMinutes: totalMinutes,
  };
}

