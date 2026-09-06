import apiClient from './api';
import {
  PandalDetailResponseDTO,
  DistanceResponseDTO,
  MetroStationResponseDTO,
} from '../types/api';
import { calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';

export async function getPandalDetail(pandalId: number): Promise<PandalDetailResponseDTO> {
  const response = await apiClient.get<PandalDetailResponseDTO>(`/pandals/${pandalId}`);
  const data = response.data;

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
}

export async function getPandalDistance(
  pandalId: number,
  lat: number,
  lon: number
): Promise<DistanceResponseDTO> {
  const response = await apiClient.get<DistanceResponseDTO>(
    `/pandals/${pandalId}/distance`,
    {
      params: { lat, lon },
    }
  );
  return response.data;
}

export async function getPandalMetros(pandalId: number): Promise<MetroStationResponseDTO[]> {
  const response = await apiClient.get<MetroStationResponseDTO[]>(`/pandals/${pandalId}/metros`);
  return response.data;
}