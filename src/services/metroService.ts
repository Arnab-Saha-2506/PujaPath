import apiClient from './api';
import {
  LineResponseDTO,
  MetroStationResponseDTO,
  PandalResponseDTO,
} from '../types/api';

export async function getMetroLines(): Promise<LineResponseDTO[]> {
  const response = await apiClient.get<LineResponseDTO[]>('/metro/lines');
  return response.data;
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
  const encodedLine = encodeURIComponent(lineName);
  const response = await apiClient.get<MetroStationResponseDTO[]>(
    `/metro/lines/${encodedLine}/stations`
  );
  const stations = response.data;

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
}

export async function getPandalsByStation(stationId: number): Promise<PandalResponseDTO[]> {
  const response = await apiClient.get<PandalResponseDTO[]>(
    `/metro/stations/${stationId}/pandals`
  );
  return response.data;
}