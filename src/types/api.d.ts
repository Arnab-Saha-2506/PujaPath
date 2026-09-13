export interface AreaResponseDTO {
  id: number;
  name: string;
}

export interface PandalResponseDTO {
  id: number;
  name: string;
  address: string;
  description: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  areaId: number;
  areaName: string;
  bestTimeToVisit?: string;
  distanceKm?: number | null;
  walkingTimeMinutes?: number | null;
  nearbyMetroStationName?: string;
}

export interface MetroStationResponseDTO {
  id: number;
  name: string;
  line: string;
  latitude: number;
  longitude: number;
  distanceKm?: number | null;
  walkingTimeMinutes?: number | null;
}

export interface PandalDetailResponseDTO {
  id: number;
  name: string;
  address: string;
  description: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  bestTimeToVisit: string;
  areaName: string;
  nearbyMetros: MetroStationResponseDTO[];
}

export interface LineResponseDTO {
  name: string;
}

export interface DistanceResponseDTO {
  pandalId: number;
  pandalName: string;
  userLatitude?: number;
  userLongitude?: number;
  distanceInKm: number;
  walkingTimeMinutes: number;
}

export interface RouteLegDTO {
  type: 'METRO' | 'PUJA';
  name: string;
  metroLine: string | null;
  distanceFromPrevKm: number;
  walkingMinutes: number;
  latitude: number;
  longitude: number;
}

export interface RouteResponseDTO {
  route: RouteLegDTO[];
  totalDistanceKm: number;
  totalWalkingMinutes: number;
  totalEstimatedMinutes: number;
}

export interface RouteRequestDTO {
  pandalIds: number[];
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

export type NearbyPlaceType =
  | 'police'
  | 'atm'
  | 'hospital'
  | 'cafe'
  | 'pharmacy'
  | 'restaurant'
  | 'toilet';

export interface NearbyPlaceDTO {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceInKm: number;
  walkingTimeMinutes: number;
  type?: NearbyPlaceType;
}

export interface NearbyPandalDTO {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distanceInKm: number;
  walkingTimeMinutes: number;
  nearbyMetroName?: string;
}

