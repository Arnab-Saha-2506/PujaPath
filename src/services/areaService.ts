import apiClient from './api';
import { AreaResponseDTO, PandalResponseDTO } from '../types/api';
import { MOCK_AREAS, MOCK_PANDALS } from './mockData';

export async function getAreas(): Promise<AreaResponseDTO[]> {
  try {
    const response = await apiClient.get<AreaResponseDTO[]>('/areas');
    return response.data;
  } catch (error) {
    console.info('[AreaService] Using fallback mock areas data');
    return MOCK_AREAS;
  }
}

export async function getAreaById(areaId: number): Promise<AreaResponseDTO> {
  try {
    const response = await apiClient.get<AreaResponseDTO>(`/areas/${areaId}`);
    return response.data;
  } catch (error) {
    const fallback = MOCK_AREAS.find((a) => a.id === Number(areaId)) || MOCK_AREAS[0];
    return fallback;
  }
}

export async function getPandalsByArea(areaId: number): Promise<PandalResponseDTO[]> {
  try {
    const response = await apiClient.get<PandalResponseDTO[]>(`/areas/${areaId}/pandals`);
    return response.data;
  } catch (error) {
    console.info(`[AreaService] Using fallback mock pandals for area ${areaId}`);
    return MOCK_PANDALS.filter((p) => p.areaId === Number(areaId) || Number(areaId) === 1);
  }
}

let cachedAllPandals: PandalResponseDTO[] | null = null;
let lastFetchTime = 0;

export async function getAllPandals(): Promise<PandalResponseDTO[]> {
  const now = Date.now();
  if (cachedAllPandals && now - lastFetchTime < 30000) {
    return cachedAllPandals;
  }

  try {
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
    return MOCK_PANDALS;
  } catch {
    return MOCK_PANDALS;
  }
}


