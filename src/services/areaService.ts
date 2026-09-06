import apiClient from './api';
import { AreaResponseDTO, PandalResponseDTO } from '../types/api';

export async function getAreas(): Promise<AreaResponseDTO[]> {
  const response = await apiClient.get<AreaResponseDTO[]>('/areas');
  return response.data;
}

export async function getAreaById(areaId: number): Promise<AreaResponseDTO> {
  const response = await apiClient.get<AreaResponseDTO>(`/areas/${areaId}`);
  return response.data;
}

export async function getPandalsByArea(areaId: number): Promise<PandalResponseDTO[]> {
  const response = await apiClient.get<PandalResponseDTO[]>(`/areas/${areaId}/pandals`);
  return response.data;
}

let cachedAllPandals: PandalResponseDTO[] | null = null;
let lastFetchTime = 0;

export async function getAllPandals(): Promise<PandalResponseDTO[]> {
  const now = Date.now();
  if (cachedAllPandals && now - lastFetchTime < 30000) {
    return cachedAllPandals;
  }

  const areas = await getAreas();
  const results = await Promise.all(
    areas.map(async (area) => {
      try {
        return await getPandalsByArea(area.id);
      } catch {
        return [];
      }
    })
  );
  const combined = results.flat();
  if (combined.length > 0) {
    cachedAllPandals = combined;
    lastFetchTime = now;
    return combined;
  }
  return [];
}