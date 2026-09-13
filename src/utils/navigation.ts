/**
 * Intelligent Navigation Deep-linking Utility
 * 
 * Rules:
 * 1. Desktop / PC: Opens standard Google Maps in browser.
 * 2. Mobile / Tablet (iOS):
 *    - Attempts to open installed Google Maps App via comgooglemaps://
 *    - If not installed, attempts to open Apple Maps App via maps://maps.apple.com/
 *    - Falls back to browser Google Maps
 * 3. Mobile / Tablet (Android):
 *    - Attempts to open installed Google Maps App via Android Intent
 *    - Falls back to browser Google Maps
 */

export function isMobileOrTabletDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent || '';
  const isTouchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  return isMobileUA || isTouchMac;
}

export function isIOSDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent || '';
  const isTouchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  return /iPad|iPhone|iPod/.test(ua) || isTouchMac;
}

export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  return /Android/i.test(navigator.userAgent || '');
}

export function openNavigation(lat: number, lon: number, destinationName?: string) {
  const isMobile = isMobileOrTabletDevice();
  const encodedName = encodeURIComponent(destinationName || 'Destination');
  const webGoogleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  // 1. Desktop: Keep default browser Google Maps
  if (!isMobile) {
    window.open(webGoogleMapsUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // 2. iOS Mobile / Tablet
  if (isIOSDevice()) {
    const googleMapsAppUrl = `comgooglemaps://?daddr=${lat},${lon}&directionsmode=walking`;
    const appleMapsAppUrl = `maps://maps.apple.com/?daddr=${lat},${lon}&dirflg=w&q=${encodedName}`;

    let appOpened = false;

    const onVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange, { once: true });

    // Try Google Maps app first
    window.location.href = googleMapsAppUrl;

    setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (!appOpened) {
        // If Google Maps not installed, try native Apple Maps app
        document.addEventListener('visibilitychange', onVisibilityChange, { once: true });
        window.location.href = appleMapsAppUrl;

        setTimeout(() => {
          document.removeEventListener('visibilitychange', onVisibilityChange);
          // If neither opened, fallback to web Google Maps
          if (!appOpened) {
            window.location.href = webGoogleMapsUrl;
          }
        }, 800);
      }
    }, 600);
    return;
  }

  // 3. Android Mobile / Tablet
  if (isAndroidDevice()) {
    const androidIntentUrl = `intent://maps.google.com/maps/dir/?api=1&destination=${lat},${lon}#Intent;scheme=https;package=com.google.android.apps.maps;end`;

    let appOpened = false;
    const onVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange, { once: true });

    // Open native Google Maps app via Android Intent
    window.location.href = androidIntentUrl;

    setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (!appOpened) {
        window.location.href = webGoogleMapsUrl;
      }
    }, 800);
    return;
  }

  // Default fallback for any other mobile environment
  window.location.href = webGoogleMapsUrl;
}

export function openRouteUrl(url: string) {
  const isMobile = isMobileOrTabletDevice();
  if (!isMobile) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  if (isAndroidDevice()) {
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.google.android.apps.maps;end`;
    window.location.href = intentUrl;
    setTimeout(() => {
      window.location.href = url;
    }, 600);
    return;
  }
  window.location.href = url;
}
