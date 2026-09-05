import apiClient from './api';
import {
  LineResponseDTO,
  MetroStationResponseDTO,
  PandalResponseDTO,
} from '../types/api';
import { MOCK_METRO_LINES, MOCK_METRO_STATIONS, MOCK_PANDALS } from './mockData';
import { calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';

export async function getMetroLines(): Promise<LineResponseDTO[]> {
  try {
    const response = await apiClient.get<LineResponseDTO[]>('/metro/lines');
    return response.data;
  } catch (error) {
    console.info('[MetroService] Using fallback mock metro lines');
    return MOCK_METRO_LINES;
  }
}

const GREEN_LINE_ORDER = [
  'howrah maidan',
  'howrah',
  'mahakaran',
  'esplanade',
  'sealdah',
  'phoolbagan',
  'salt lake stadium',
  'bengal chemical',
  'city centre',
  'central park',
  'karunamoyee',
  'saltlake sector v',
  'salt lake sector v',
];

export async function getStationsByLine(lineName: string): Promise<MetroStationResponseDTO[]> {
  try {
    const encodedLine = encodeURIComponent(lineName);
    const response = await apiClient.get<MetroStationResponseDTO[]>(
      `/metro/lines/${encodedLine}/stations`
    );
    const stations = response.data;

    // Ensure Green Line follows the official route sequence
    if (lineName.toLowerCase().includes('green')) {
      return [...stations].sort((a, b) => {
        const idxA = GREEN_LINE_ORDER.findIndex((name) =>
          a.name.toLowerCase().replace(/\s+/g, ' ').trim().includes(name)
        );
        const idxB = GREEN_LINE_ORDER.findIndex((name) =>
          b.name.toLowerCase().replace(/\s+/g, ' ').trim().includes(name)
        );
        if (idxA === -1 && idxB === -1) return 0;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
    }

    return stations;
  } catch (error) {
    console.info(`[MetroService] Using fallback stations for ${lineName}`);
    return MOCK_METRO_STATIONS[lineName] || MOCK_METRO_STATIONS['Blue Line'] || [];
  }
}


export async function getPandalsByStation(stationId: number): Promise<PandalResponseDTO[]> {
  try {
    const response = await apiClient.get<PandalResponseDTO[]>(
      `/metro/stations/${stationId}/pandals`
    );
    return response.data;
  } catch (error) {
    console.info(`[MetroService] Using fallback pandals for station ${stationId}`);
    // Find station coordinates
    let station: MetroStationResponseDTO | undefined;
    for (const stations of Object.values(MOCK_METRO_STATIONS)) {
      station = stations.find((s) => s.id === Number(stationId));
      if (station) break;
    }

    if (!station) {
      return MOCK_PANDALS.slice(0, 5);
    }

    // Sort pandals by distance to this station and attach distance & walking time
    return MOCK_PANDALS.map((pandal) => {
      const dist = calculateHaversineDistance(
        station!.latitude,
        station!.longitude,
        pandal.latitude,
        pandal.longitude
      );
      return {
        ...pandal,
        distanceKm: dist,
        walkingTimeMinutes: estimateWalkingTime(dist),
      };
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }
}

