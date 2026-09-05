/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(2));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Assumes average walking speed in Kolkata Puja crowds is 5 km/h.
 */
export function estimateWalkingTime(distanceInKm: number): number {
  if (distanceInKm <= 0) return 1;
  const hours = distanceInKm / 5;
  const minutes = Math.round(hours * 60);
  return Math.max(1, minutes);
}

export function formatDistance(distanceInKm: number | null | undefined): string {
  if (distanceInKm === null || distanceInKm === undefined || isNaN(distanceInKm)) {
    return '-- km';
  }
  if (distanceInKm < 1) {
    const meters = Math.round(distanceInKm * 1000);
    return `${meters} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
}

export function formatWalkingTime(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined || isNaN(minutes)) {
    return '-- min walk';
  }
  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hrs}h ${remainingMins}m walk` : `${hrs}h walk`;
  }
  return `${minutes} min walk`;
}

