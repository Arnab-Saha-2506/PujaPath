import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { RouteResponseDTO } from '../types/api';
import { getOptimizedRoute } from '../services/routeService';

interface RouteContextType {
  selectedPandalIds: number[];
  togglePandalSelection: (id: number) => void;
  isPandalSelected: (id: number) => boolean;
  addPandal: (id: number) => void;
  removePandal: (id: number) => void;
  clearSelection: () => void;
  setSelectedPandalIds: (ids: number[]) => void;
  // Route optimization result
  routeResult: RouteResponseDTO | null;
  isLoadingRoute: boolean;
  routeError: string | null;
  calculateRoute: (ids?: number[]) => Promise<RouteResponseDTO | null>;
  resetRoute: () => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

const STORAGE_KEY = 'pujapath_selected_pandal_ids';

// Default starter pandals (South Kolkata iconic loop)
export const DEFAULT_PRESET_CIRCUIT = [10, 11, 12, 19];

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPandalIds, setSelectedPandalIdsState] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clean out previous default [10, 11, 12, 19] so user starts with 0 selected
        if (
          Array.isArray(parsed) &&
          parsed.length === 4 &&
          parsed[0] === 10 &&
          parsed[1] === 11 &&
          parsed[2] === 12 &&
          parsed[3] === 19
        ) {
          localStorage.removeItem(STORAGE_KEY);
          return [];
        }
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [routeResult, setRouteResult] = useState<RouteResponseDTO | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPandalIds));
    } catch {
      // ignore
    }
  }, [selectedPandalIds]);

  const setSelectedPandalIds = useCallback((ids: number[]) => {
    setSelectedPandalIdsState(ids);
  }, []);

  const isPandalSelected = useCallback(
    (id: number) => selectedPandalIds.includes(id),
    [selectedPandalIds]
  );

  const togglePandalSelection = useCallback((id: number) => {
    setSelectedPandalIdsState((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const addPandal = useCallback((id: number) => {
    setSelectedPandalIdsState((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removePandal = useCallback((id: number) => {
    setSelectedPandalIdsState((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPandalIdsState([]);
    setRouteResult(null);
  }, []);

  const calculateRoute = useCallback(
    async (ids?: number[]): Promise<RouteResponseDTO | null> => {
      const targetIds = ids || selectedPandalIds;
      if (!targetIds || targetIds.length === 0) {
        setRouteError('Please select at least one pandal to build a route.');
        return null;
      }

      try {
        setIsLoadingRoute(true);
        setRouteError(null);
        const data = await getOptimizedRoute(targetIds);
        setRouteResult(data);
        return data;
      } catch (err: any) {
        const msg = err?.message || 'Failed to generate optimized route.';
        setRouteError(msg);
        return null;
      } finally {
        setIsLoadingRoute(false);
      }
    },
    [selectedPandalIds]
  );

  const resetRoute = useCallback(() => {
    setRouteResult(null);
    setRouteError(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedPandalIds,
      togglePandalSelection,
      isPandalSelected,
      addPandal,
      removePandal,
      clearSelection,
      setSelectedPandalIds,
      routeResult,
      isLoadingRoute,
      routeError,
      calculateRoute,
      resetRoute,
    }),
    [
      selectedPandalIds,
      togglePandalSelection,
      isPandalSelected,
      addPandal,
      removePandal,
      clearSelection,
      setSelectedPandalIds,
      routeResult,
      isLoadingRoute,
      routeError,
      calculateRoute,
      resetRoute,
    ]
  );

  return <RouteContext.Provider value={contextValue}>{children}</RouteContext.Provider>;
};

export function useRoutePlanner(): RouteContextType {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoutePlanner must be used within a RouteProvider');
  }
  return context;
}

