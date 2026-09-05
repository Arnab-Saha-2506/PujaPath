import apiClient from './api';
import {
  PandalDetailResponseDTO,
  DistanceResponseDTO,
  MetroStationResponseDTO,
} from '../types/api';
import { getMockPandalDetail } from './mockData';
import { calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';

export async function getPandalDetail(pandalId: number): Promise<PandalDetailResponseDTO> {
  try {
    const response = await apiClient.get<PandalDetailResponseDTO>(`/pandals/${pandalId}`);
    const data = response.data;

    // Enrich nearby metros distance if null from backend
    if (data.nearbyMetros && data.latitude && data.longitude) {
      data.nearbyMetros = data.nearbyMetros.map((metro) => {
        if (metro.distanceKm == null && metro.latitude && metro.longitude) {
          const dist = calculateHaversineDistance(
            data.latitude,
            data.longitude,
            metro.latitude,
            metro.longitude
          );
          return {
            ...metro,
            distanceKm: dist,
            walkingTimeMinutes: estimateWalkingTime(dist),
          };
        }
        return metro;
      });
    }

    return data;
  } catch (error) {
    console.info(`[PandalService] Using fallback mock detail for pandal ${pandalId}`);
    return getMockPandalDetail(pandalId);
  }
}

export async function getPandalDistance(
  pandalId: number,
  lat: number,
  lon: number
): Promise<DistanceResponseDTO> {
  try {
    const response = await apiClient.get<DistanceResponseDTO>(
      `/pandals/${pandalId}/distance`,
      {
        params: { lat, lon },
      }
    );
    return response.data;
  } catch (error) {
    console.info(`[PandalService] Computing distance fallback for pandal ${pandalId}`);
    const detail = getMockPandalDetail(pandalId);
    const dist = calculateHaversineDistance(lat, lon, detail.latitude, detail.longitude);
    return {
      pandalId,
      pandalName: detail.name,
      userLatitude: lat,
      userLongitude: lon,
      distanceInKm: dist,
      walkingTimeMinutes: estimateWalkingTime(dist),
    };
  }
}

export async function getPandalMetros(pandalId: number): Promise<MetroStationResponseDTO[]> {
  try {
    const response = await apiClient.get<MetroStationResponseDTO[]>(`/pandals/${pandalId}/metros`);
    return response.data;
  } catch (error) {
    const detail = getMockPandalDetail(pandalId);
    return detail.nearbyMetros;
  }
}

