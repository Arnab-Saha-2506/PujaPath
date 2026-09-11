import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NearbyPandalDTO, NearbyPlaceDTO, NearbyPlaceType } from '../../types/api';
import { ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { openNavigation } from '../../utils/navigation';

export interface MapItem {
  id: string | number;
  itemType: 'pandal' | NearbyPlaceType;
  name: string;
  latitude: number;
  longitude: number;
  distanceInKm: number;
  walkingTimeMinutes: number;
  nearbyMetroName?: string;
  address?: string;
  originalPandal?: NearbyPandalDTO;
  originalPlace?: NearbyPlaceDTO;
}

interface NearbyMapProps {
  userLat: number | null;
  userLon: number | null;
  items: MapItem[];
  selectedItemId: string | number | null;
  onSelectItem: (item: MapItem | null) => void;
  heightClass?: string;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; border: string; text: string; iconSvg: string }
> = {
  pandal: {
    label: 'Durga Pandal',
    bg: 'bg-vermilion',
    border: 'border-amber-300',
    text: 'text-white',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 2l3 7h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z"/></svg>`,
  },
  police: {
    label: 'Police Station',
    bg: 'bg-blue-600',
    border: 'border-blue-300',
    text: 'text-white',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  atm: {
    label: 'ATM',
    bg: 'bg-emerald-600',
    border: 'border-emerald-300',
    text: 'text-white',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
  },
  hospital: {
    label: 'Hospital',
    bg: 'bg-rose-600',
    border: 'border-rose-300',
    text: 'text-white',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 6v12m-6-6h12"/></svg>`,
  },
  cafe: {
    label: 'Cafe',
    bg: 'bg-amber-700',
    border: 'border-amber-400',
    text: 'text-white',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1"/><path d="M5 8h14"/><path d="M9 12v4"/><path d="M15 12v4"/></svg>`,
  },
  pharmacy: {
    label: 'Pharmacy',
    bg: 'bg-violet-600',
    border: 'border-violet-300',
    text: 'text-white',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
  },
  restaurant: {
    label: 'Restaurant',
    bg: 'bg-orange-600',
    border: 'border-orange-300',
    text: 'text-white',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v18"/><path d="M6 2v20"/><path d="M6 10h4a2 2 0 0 0 2-2V2"/></svg>`,
  },
  toilet: {
    label: 'Public Toilet',
    bg: 'bg-teal-600',
    border: 'border-teal-300',
    text: 'text-white',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M7 21v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/><rect x="4" y="3" width="16" height="10" rx="2"/><circle cx="12" cy="8" r="2"/></svg>`,
  },
};

export const NearbyMap: React.FC<NearbyMapProps> = ({
  userLat,
  userLon,
  items,
  selectedItemId,
  onSelectItem,
  heightClass = 'h-[480px] sm:h-[540px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Map<string | number, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);

  const navigate = useNavigate();
  const onSelectItemRef = useRef(onSelectItem);
  onSelectItemRef.current = onSelectItem;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  // Initialize Map with 100% free OpenStreetMap colorful tiles (No API key, No watermarks)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = userLat ?? 22.518;
    const initialLon = userLon ?? 88.353;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 15,
      zoomControl: false,
    });

    // 100% Free OpenStreetMap tile server with crisp colorful streets & zero watermarks
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    }).addTo(map);

    const userGroup = L.layerGroup().addTo(map);
    userLayerRef.current = userGroup;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update User Location Marker & Accuracy Ring
  useEffect(() => {
    const map = mapInstanceRef.current;
    const userGroup = userLayerRef.current;
    if (!map || !userGroup || userLat === null || userLon === null) return;

    userGroup.clearLayers();

    // Accuracy perimeter circle
    const accuracyCircle = L.circle([userLat, userLon], {
      radius: 75,
      color: '#2563EB',
      fillColor: '#3B82F6',
      fillOpacity: 0.15,
      weight: 1.5,
      dashArray: '4, 4',
    });
    userGroup.addLayer(accuracyCircle);

    // High visibility pulsing user location pin
    const userHtml = `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 40px; height: 40px; border-radius: 9999px; background-color: rgba(37, 99, 235, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <span style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background-color: #1D4ED8; border: 3px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
          <span style="width: 6px; height: 6px; border-radius: 9999px; background-color: #FFFFFF;"></span>
        </span>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: userHtml,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const userMarker = L.marker([userLat, userLon], {
      icon: userIcon,
      zIndexOffset: 10000,
    });

    userMarker.bindPopup(`
      <div class="p-2.5 text-left font-sans">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          <strong class="text-xs text-blue-700 dark:text-blue-400">Your Location</strong>
        </div>
        <div class="text-[11px] text-stone-600 dark:text-stone-300">
          GPS Coordinates: ${userLat.toFixed(4)}° N, ${userLon.toFixed(4)}° E
        </div>
      </div>
    `, {
      className: 'custom-festive-popup',
      closeButton: false,
    });

    userMarker.bindTooltip('<b>You are here</b>', {
      permanent: false,
      direction: 'top',
      offset: [0, -14],
      className: 'font-semibold text-xs',
    });

    userGroup.addLayer(userMarker);
    userMarkerRef.current = userMarker;
  }, [userLat, userLon]);

  // Update POI Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    markersMapRef.current.clear();

    const bounds = L.latLngBounds([]);
    if (userLat !== null && userLon !== null) {
      bounds.extend([userLat, userLon]);
    }

    items.forEach((item) => {
      if (!item.latitude || !item.longitude) return;

      const isPandal = item.itemType === 'pandal';
      const config = TYPE_CONFIG[item.itemType] || TYPE_CONFIG.pandal;
      const isSelected = selectedItemId === item.id;

      const markerHtml = `
        <div class="group relative flex items-center justify-center transition-transform hover:scale-110 ${isSelected ? 'scale-125 z-50' : 'z-10'
        }">
          <div class="w-8 h-8 rounded-full ${config.bg} ${config.text} border-2 ${isSelected ? 'border-yellow-400 ring-4 ring-yellow-400/40' : config.border
        } shadow-lg flex items-center justify-center transition-all cursor-pointer">
            ${config.iconSvg}
          </div>
          <div class="absolute -bottom-1 w-2 h-2 bg-inherit transform rotate-45"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([item.latitude, item.longitude], {
        icon: customIcon,
      });

      const popupDiv = document.createElement('div');
      popupDiv.className = 'pandal-map-popup p-3 max-w-[260px] text-left';

      popupDiv.innerHTML = `
        <div class="flex items-center gap-1.5 mb-1.5">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isPandal
          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
        }">
            ${config.label}
          </span>
          <span class="text-[11px] font-semibold text-amber-600 dark:text-amber-400 ml-auto">
            📍 ${item.distanceInKm.toFixed(2)} km
          </span>
        </div>
        <h4 class="font-bold text-sm text-stone-900 dark:text-stone-100 mb-1 leading-snug">
          ${item.name}
        </h4>
        ${item.nearbyMetroName
          ? `<p class="text-[11px] text-stone-600 dark:text-stone-400 mb-2">
                🚇 Metro: <strong>${item.nearbyMetroName}</strong>
               </p>`
          : ''
        }
        <div class="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2 mb-3">
          <span>🚶 ~${item.walkingTimeMinutes} min walk</span>
          ${item.address ? `<span>• ${item.address}</span>` : ''}
        </div>
        <div class="flex items-center gap-2 pt-1 border-t border-stone-200 dark:border-stone-700">
          ${isPandal
          ? `<button id="btn-pandal-detail-${item.id}" class="flex-1 inline-flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg shadow-xs transition-colors cursor-pointer">
                  <span>View Pandal</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </button>`
          : ''
        }
          <button id="btn-nav-${item.id}" class="${
            isPandal ? 'p-1.5' : 'flex-1 py-1.5 px-2.5'
          } inline-flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
            <span>${isPandal ? 'Map' : 'Directions'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv, {
        closeButton: true,
        className: 'custom-festive-popup',
        maxWidth: 280,
      });

      marker.on('popupopen', () => {
        onSelectItemRef.current(item);
        if (isPandal) {
          const detailBtn = document.getElementById(`btn-pandal-detail-${item.id}`);
          if (detailBtn) {
            detailBtn.onclick = (e) => {
              e.preventDefault();
              const pandalId = item.originalPandal?.id ?? item.id;
              navigateRef.current(`/pandals/${pandalId}`);
            };
          }
        }
        const navBtn = document.getElementById(`btn-nav-${item.id}`);
        if (navBtn) {
          navBtn.onclick = (e) => {
            e.preventDefault();
            openNavigation(item.latitude, item.longitude, item.name);
          };
        }
      });

      marker.on('click', () => {
        onSelectItemRef.current(item);
      });

      markersGroup.addLayer(marker);
      markersMapRef.current.set(item.id, marker);
      bounds.extend([item.latitude, item.longitude]);
    });

    if (items.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 16 });
    } else if (userLat !== null && userLon !== null) {
      map.setView([userLat, userLon], 15);
    }
  }, [items, userLat, userLon]);

  // React to selectedItemId from outside (e.g. clicking quick highlight card)
  useEffect(() => {
    if (selectedItemId === null) return;
    const marker = markersMapRef.current.get(selectedItemId);
    const map = mapInstanceRef.current;
    if (marker && map) {
      const latLng = marker.getLatLng();
      map.flyTo(latLng, Math.max(map.getZoom(), 16), {
        duration: 0.6,
      });
      marker.openPopup();
    }
  }, [selectedItemId]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (userLat !== null && userLon !== null) {
      map.flyTo([userLat, userLon], 16, { duration: 0.8 });
      userMarkerRef.current?.openPopup();
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-ivory-border dark:border-obsidian-300 shadow-warm-md`}>
      {/* Map Canvas - Always colorful OpenStreetMap */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          title="Center on my location"
          className="w-10 h-10 rounded-xl bg-white/95 text-blue-600 shadow-md hover:bg-blue-50 border border-blue-100 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
        >
          <Compass className="w-5 h-5" />
        </button>
        <div className="bg-white/95 border border-stone-200 rounded-xl shadow-md flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            title="Zoom in"
            className="w-10 h-10 text-stone-700 hover:text-vermilion hover:bg-stone-50 flex items-center justify-center border-b border-stone-200 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom out"
            className="w-10 h-10 text-stone-700 hover:text-vermilion hover:bg-stone-50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend Pill at Bottom Left */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2.5 bg-white/95 px-3 py-1.5 rounded-xl border border-stone-200 text-[11px] shadow-sm">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          <span className="text-stone-800 font-semibold">You</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-vermilion inline-block" />
          <span className="text-stone-700 font-medium">Pandal</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
          <span className="text-stone-700 font-medium">Police</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span className="text-stone-700 font-medium">ATM</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
          <span className="text-stone-700 font-medium">Hospital</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />
          <span className="text-stone-700 font-medium">Pharmacy</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
          <span className="text-stone-700 font-medium">Cafe</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block" />
          <span className="text-stone-700 font-medium">Restaurant</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
          <span className="text-stone-700 font-medium">Toilet</span>
        </div>
      </div>
    </div>
  );
};
