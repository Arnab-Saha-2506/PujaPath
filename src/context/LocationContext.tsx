import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type LocationStatus = 'idle' | 'prompt' | 'granted' | 'denied' | 'unavailable';

export interface LocationContextType {
  latitude: number | null;
  longitude: number | null;
  status: LocationStatus;
  error: string | null;
  isLocating: boolean;
  requestLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
  simulateKolkataLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_LAT_KEY = 'pujapath_lat';
const STORAGE_LON_KEY = 'pujapath_lon';
const STORAGE_TIMESTAMP_KEY = 'pujapath_loc_time';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes cache

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<number>(0);

  // Restore cached coordinates on mount
  useEffect(() => {
    try {
      const cachedLat = sessionStorage.getItem(STORAGE_LAT_KEY);
      const cachedLon = sessionStorage.getItem(STORAGE_LON_KEY);
      const cachedTime = sessionStorage.getItem(STORAGE_TIMESTAMP_KEY);

      if (cachedLat && cachedLon && cachedTime) {
        const timeDiff = Date.now() - parseInt(cachedTime, 10);
        if (timeDiff < CACHE_DURATION_MS) {
          setLatitude(parseFloat(cachedLat));
          setLongitude(parseFloat(cachedLon));
          setStatus('granted');
        }
      }
    } catch {
      // sessionStorage might be restricted
    }
  }, []);

  const fetchPosition = useCallback((): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (geoError) => {
          reject(geoError);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const requestLocation = useCallback(async () => {
    // Debounce check
    const now = Date.now();
    if (now - lastRefreshed < 3000 && latitude !== null) {
      return;
    }

    setIsLocating(true);
    setError(null);

    try {
      const { lat, lon } = await fetchPosition();
      setLatitude(lat);
      setLongitude(lon);
      setStatus('granted');
      setLastRefreshed(now);

      try {
        sessionStorage.setItem(STORAGE_LAT_KEY, lat.toString());
        sessionStorage.setItem(STORAGE_LON_KEY, lon.toString());
        sessionStorage.setItem(STORAGE_TIMESTAMP_KEY, now.toString());
      } catch {
        // ignore storage errors
      }
    } catch (err: any) {
      if (err.code === 1) {
        // PERMISSION_DENIED
        setStatus('denied');
        setError('Location permission denied. You can still search pandals or choose a simulated Kolkata location.');
      } else if (err.code === 2) {
        // POSITION_UNAVAILABLE
        setStatus('unavailable');
        setError('Position unavailable. Please ensure your device GPS is enabled.');
      } else if (err.code === 3) {
        // TIMEOUT
        setStatus('unavailable');
        setError('Location request timed out. Please try again.');
      } else {
        setStatus('unavailable');
        setError(err.message || 'Failed to detect location.');
      }
    } finally {
      setIsLocating(false);
    }
  }, [fetchPosition, lastRefreshed, latitude]);

  const refreshLocation = useCallback(async () => {
    await requestLocation();
  }, [requestLocation]);

  // Convenience helper for testing outdoors / desktop without real Kolkata GPS
  const simulateKolkataLocation = useCallback(() => {
    // Coordinates near Deshapriya Park / Kalighat: 22.518, 88.353
    const lat = 22.518;
    const lon = 88.353;
    setLatitude(lat);
    setLongitude(lon);
    setStatus('granted');
    setError(null);
    try {
      sessionStorage.setItem(STORAGE_LAT_KEY, lat.toString());
      sessionStorage.setItem(STORAGE_LON_KEY, lon.toString());
      sessionStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    } catch {
      // ignore
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        latitude,
        longitude,
        status,
        error,
        isLocating,
        requestLocation,
        refreshLocation,
        simulateKolkataLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useLocationContext(): LocationContextType {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}

