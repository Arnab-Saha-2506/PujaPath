import apiClient from './api';
import { RouteResponseDTO, RouteRequestDTO, RouteLegDTO, PandalResponseDTO } from '../types/api';
import { MOCK_PANDALS } from './mockData';
import { getNearestMetroStation } from '../utils/nearestMetro';
import { calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';
import { getAllPandals } from './areaService';

/**
 * Merges any pandals dropped by the backend (because they lack DB metro stations)
 * into the turn-by-turn route itinerary using coordinate-based nearest metro routing.
 */
function mergeMissingPandalsIntoRoute(
  serverRoute: RouteResponseDTO,
  missingPandals: PandalResponseDTO[]
): RouteResponseDTO {
  const route: RouteLegDTO[] = [...serverRoute.route];
  let totalKm = serverRoute.totalDistanceKm || 0;
  let totalMins = serverRoute.totalWalkingMinutes || 0;

  for (const pandal of missingPandals) {
    const lastLeg = route[route.length - 1];
    const prevLat = lastLeg ? lastLeg.latitude : pandal.latitude;
    const prevLon = lastLeg ? lastLeg.longitude : pandal.longitude;
    const dist = calculateHaversineDistance(prevLat, prevLon, pandal.latitude, pandal.longitude);

    const nearestMetro = getNearestMetroStation(pandal.latitude, pandal.longitude);

    // If distance from last stop is > 1.8km, add a metro transit leg
    if (dist > 1.8 && nearestMetro) {
      const transitDist = Number((dist * 0.7).toFixed(2));
      const transitWalk = Math.max(2, Math.round(estimateWalkingTime(dist * 0.3)));
      route.push({
        type: 'METRO',
        name: nearestMetro.name,
        metroLine: nearestMetro.line,
        distanceFromPrevKm: transitDist,
        walkingMinutes: transitWalk,
        latitude: pandal.latitude - 0.003,
        longitude: pandal.longitude - 0.002,
      });
      totalKm += transitDist;
      totalMins += transitWalk;

      const walkingToPandal = Number((dist * 0.3).toFixed(2));
      route.push({
        type: 'PUJA',
        name: pandal.name,
        metroLine: null,
        distanceFromPrevKm: walkingToPandal,
        walkingMinutes: transitWalk,
        latitude: pandal.latitude,
        longitude: pandal.longitude,
      });
      totalKm += walkingToPandal;
      totalMins += transitWalk;
    } else {
      // Direct walking from previous leg
      const walkTime = estimateWalkingTime(dist);
      route.push({
        type: 'PUJA',
        name: pandal.name,
        metroLine: null,
        distanceFromPrevKm: dist,
        walkingMinutes: walkTime,
        latitude: pandal.latitude,
        longitude: pandal.longitude,
      });
      totalKm += dist;
      totalMins += walkTime;
    }
  }

  return {
    route,
    totalDistanceKm: Number(totalKm.toFixed(2)),
    totalWalkingMinutes: totalMins,
    totalEstimatedMinutes: totalMins,
  };
}

/**
 * Request an optimized parikrama itinerary:
 * 1. Calls backend API: POST /api/v1/routes
 * 2. If the backend drops any selected pandal (because it has no metro in DB),
 *    merges the missing pandals using their coordinate-based nearest metro station.
 * 3. If the backend fails or returns 0 steps, falls back to full coordinate-based route generation.
 */
export async function getOptimizedRoute(
  pandalIds: number[],
  knownPandals?: PandalResponseDTO[]
): Promise<RouteResponseDTO> {
  if (!pandalIds || pandalIds.length === 0) {
    return {
      route: [],
      totalDistanceKm: 0,
      totalWalkingMinutes: 0,
      totalEstimatedMinutes: 0,
    };
  }

  // Retrieve pandal objects
  let allPandals = knownPandals;
  if (!allPandals || allPandals.length === 0) {
    try {
      allPandals = await getAllPandals();
    } catch {
      allPandals = [];
    }
  }

  const pandalsMap = new Map<number, PandalResponseDTO>();
  (allPandals || []).forEach((p) => pandalsMap.set(p.id, p));
  MOCK_PANDALS.forEach((p) => {
    if (!pandalsMap.has(p.id)) pandalsMap.set(p.id, p);
  });

  const selectedPandals = pandalIds
    .map((id) => pandalsMap.get(id))
    .filter(Boolean) as PandalResponseDTO[];

  try {
    const payload: RouteRequestDTO = { pandalIds };
    const response = await apiClient.post<RouteResponseDTO>('/routes', payload);
    if (response.data && Array.isArray(response.data.route) && response.data.route.length > 0) {
      // Check which selected pandals the backend returned
      const returnedPujaNames = new Set(
        response.data.route
          .filter((l) => l.type === 'PUJA')
          .map((l) => l.name.toLowerCase().trim())
      );

      const missingPandals = selectedPandals.filter(
        (p) => !returnedPujaNames.has(p.name.toLowerCase().trim())
      );

      // If all selected pandals are in the server route, return it
      if (missingPandals.length === 0) {
        return response.data;
      }

      // If backend omitted pandals without a metro in DB, merge them using nearest metro by coordinates
      return mergeMissingPandalsIntoRoute(response.data, missingPandals);
    }
  } catch (error) {
    console.warn(
      '[PujaPath Route] Server route optimization unavailable, using coordinate-based nearest metro routing:',
      error
    );
  }

  // Fallback complete route calculation using nearest metro station by coordinates
  return generateClientRouteFallback(pandalIds, selectedPandals);
}

/**
 * Client-side route generator that maps all pandals to their nearest metro stations
 * according to coordinates if no metro is associated in DB.
 */
async function generateClientRouteFallback(
  pandalIds: number[],
  knownPandals?: PandalResponseDTO[]
): Promise<RouteResponseDTO> {
  let allPandals = knownPandals;
  if (!allPandals || allPandals.length === 0) {
    try {
      allPandals = await getAllPandals();
    } catch {
      allPandals = [];
    }
  }

  const pandalsMap = new Map<number, PandalResponseDTO>();
  (allPandals || []).forEach((p) => pandalsMap.set(p.id, p));
  MOCK_PANDALS.forEach((p) => {
    if (!pandalsMap.has(p.id)) pandalsMap.set(p.id, p);
  });

  const selectedPandals = pandalIds
    .map((id) => pandalsMap.get(id))
    .filter(Boolean) as PandalResponseDTO[];

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
    // Determine closest metro station according to coordinates if not associated in DB
    const metroFromCoords = getNearestMetroStation(pandal.latitude, pandal.longitude);
    const metroName =
      pandal.nearbyMetroStationName?.trim() || metroFromCoords?.name || 'Kolkata Metro';
    const metroLine = metroFromCoords?.line || 'Blue Line';

    // If first stop, add starting transit metro hub
    if (index === 0 && (metroFromCoords || pandal.nearbyMetroStationName)) {
      const metroLat = pandal.latitude - 0.003;
      const metroLon = pandal.longitude - 0.002;

      legs.push({
        type: 'METRO',
        name: metroName,
        metroLine: metroLine,
        distanceFromPrevKm: 0,
        walkingMinutes: 0,
        latitude: metroLat,
        longitude: metroLon,
      });
      prevLat = metroLat;
      prevLon = metroLon;
    } else if (index > 0 && prevLat !== null && prevLon !== null) {
      // If distance from previous pandal is large (> 1.8km), add connecting metro station
      const directDist = calculateHaversineDistance(
        prevLat,
        prevLon,
        pandal.latitude,
        pandal.longitude
      );

      if (directDist > 1.8) {
        const transitDist = Number((directDist * 0.7).toFixed(2));
        const transitWalk = Math.max(2, Math.round(estimateWalkingTime(directDist * 0.3)));

        legs.push({
          type: 'METRO',
          name: metroName,
          metroLine: metroLine,
          distanceFromPrevKm: transitDist,
          walkingMinutes: transitWalk,
          latitude: pandal.latitude - 0.003,
          longitude: pandal.longitude - 0.002,
        });

        totalKm += transitDist;
        totalMinutes += transitWalk;
        prevLat = pandal.latitude - 0.003;
        prevLon = pandal.longitude - 0.002;
      }
    }

    const dist =
      prevLat !== null && prevLon !== null
        ? calculateHaversineDistance(prevLat, prevLon, pandal.latitude, pandal.longitude)
        : 0.8;
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
