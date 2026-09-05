import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PandalDetailResponseDTO, DistanceResponseDTO, PandalResponseDTO } from '../types/api';
import { getPandalDetail, getPandalDistance } from '../services/pandalService';
import { getAllPandals } from '../services/areaService';
import { useGeolocation } from '../hooks/useGeolocation';
import { PandalFallbackGraphic } from '../components/pandals/PandalFallbackGraphic';
import { SankhaLoader } from '../components/common/SankhaLoader';
import { BestTimeBadge } from '../components/pandals/BestTimeBadge';
import { PandalCard } from '../components/pandals/PandalCard';
import { getMetroLineMeta, parseStationLines } from '../utils/metroColors';
import { formatDistance, formatWalkingTime, calculateHaversineDistance, estimateWalkingTime } from '../utils/distance';
import { ErrorBanner } from '../components/common/ErrorBanner';
import {
  MapPin,
  Train,
  Navigation,
  Clock,
  RefreshCw,
  ArrowLeft,
  Share2,
  Footprints,
  Compass,
  ArrowRight,
  Info,
  Lightbulb,
  Route,
} from 'lucide-react';

function getPandalProTip(pandal: PandalDetailResponseDTO): string {
  const name = pandal.name.toLowerCase();

  // North Kolkata Iconic Pandals
  if (name.includes('baghbazar')) {
    return 'One of Bengal\'s oldest community pujas (since 1919). Traditional Ekchala Pratima and immersion carnival on Bijoya Dashami. Shyambazar Metro is an 8-min walk.';
  }
  if (name.includes('kumartuli') || name.includes('kumortuli')) {
    return 'Located in the historic artisans\' district of clay sculptors. Sovabazar Sutanuti Metro is closest exit (5-min walk). Ideal to explore idol-making alleyways before evening.';
  }
  if (name.includes('hatkhola')) {
    return 'Heritage North Kolkata puja near Kumartuli ghat. Combine with Kumartuli Park and Ahiritola for a complete riverfront walking circuit.';
  }
  if (name.includes('jagat mukherjee')) {
    return 'Pioneers of creative thematic engineering in North Kolkata. Shyambazar or Sovabazar Metro are a 6-min walk.';
  }
  if (name.includes('hedua')) {
    return 'Heritage park celebration in Manicktala. Girish Park Metro is within 600m walking distance.';
  }
  if (name.includes('nimtala') || name.includes('ahiritola')) {
    return 'Historic riverside celebration along the Ganges. Take Sovabazar Sutanuti Metro and walk towards Nimtala Ghat.';
  }

  // Central Kolkata Iconic Pandals
  if (name.includes('college square')) {
    return 'World-famous for its illuminated temple facade reflecting over the heritage lake. MG Road or Central Metro stations are closest transit links.';
  }
  if (name.includes('md. ali') || name.includes('mohammad ali')) {
    return 'Iconic central Kolkata heritage venue celebrated for monumental replicas. Central or MG Road Metro station offers direct pedestrian access.';
  }
  if (name.includes('santosh mitra') || name.includes('lebutala')) {
    return 'World-renowned for diamond jubilee architectural replicas and laser-light shows. Sealdah or Central Metro station are within 800m.';
  }

  // South Kolkata Iconic Pandals
  if (name.includes('deshapriyo') || name.includes('deshapriya')) {
    return 'Exit Kalighat Metro (Gate 3) and walk along Rasbehari Avenue. Avoid personal vehicles or cabs as police implement full pedestrian zoning on the avenue after 4 PM.';
  }
  if (name.includes('tridhara')) {
    return 'Located near the Monoharpukur-Rasbehari junction. Easiest transit via Jatin Das Park or Kalighat Metro. Pair this visit with nearby Ballygunge Cultural and Deshapriyo Park in one seamless walking loop.';
  }
  if (name.includes('ballygunge cultural')) {
    return 'Morning visiting slots (8:00 AM – 11:30 AM) offer serene viewing of the authentic Ekchala Pratima and Dhaki performances without evening queue barricades.';
  }
  if (name.includes('suruchi sangha')) {
    return 'Take Majerhat (Purple Line) or Taratala Metro to bypass New Alipore road traffic. Midnight visits (after 1:00 AM) have much shorter queue waiting times.';
  }
  if (name.includes('maddox square')) {
    return 'The quintessential open-air Puja adda with vast open lawns. Best visited between 4 PM and 8 PM with friends; Netaji Bhavan Metro station is a 7-min walk via Harish Mukherjee Road.';
  }
  if (name.includes('chetla agrani')) {
    return 'Kalighat Metro is the fastest link. Cross via the pedestrian bridge over Tolly\'s Nullah directly into Chetla to avoid Alipore traffic diversions.';
  }
  if (name.includes('ekdalia evergreen')) {
    return 'Famous for German chandelier lighting and authentic heritage facade. Combine with Singhi Park next door. Ballygunge Railway Station or Kalighat Metro are closest transit hubs.';
  }
  if (name.includes('badamtala ashar')) {
    return 'Just a 4-minute walk from Kalighat Metro exit. Illuminations and kinetic theme setups look most spectacular after 10:00 PM.';
  }
  if (name.includes('bosepukur')) {
    return 'Pioneers of theme puja in Kasba. Reach via Ballygunge station auto or Ruby EM Bypass. Mid-afternoon (2:30 PM - 5:00 PM) has shortest queues.';
  }
  if (name.includes('naktala udayan')) {
    return 'Take Gitanjali or Masterda Surya Sen Metro station directly into Naktala, bypassing heavy festive vehicular traffic on NSC Bose Road.';
  }
  if (name.includes('66 pally')) {
    return 'Right beside Kalighat Metro and Badamtala Ashar Sangha. You can easily visit both in a single 15-minute walking circuit.';
  }
  if (name.includes('mudiali')) {
    return 'Kalighat or Rabindra Sarobar Metro are within 800m. World-renowned for tranquil illumination and traditional metal craftwork.';
  }

  // Dynamic contextual fallback based on nearby metro stations
  if (pandal.nearbyMetros && pandal.nearbyMetros.length > 0) {
    const nearest = pandal.nearbyMetros[0];
    const walk = nearest.walkingTimeMinutes ? `${nearest.walkingTimeMinutes} min walk` : 'a short walk';
    return `Easiest access is via ${nearest.name} Metro (${nearest.line}), approximately ${walk} away. Best crowd hours: ${pandal.bestTimeToVisit || 'Evening'}.`;
  }

  return `Optimal visiting slot: ${pandal.bestTimeToVisit || 'Evening'}. Use Kolkata Metro for direct walking access to bypass festive road diversions.`;
}

export const PandalDetail: React.FC = () => {
  const { pandalId } = useParams<{ pandalId: string }>();
  const id = parseInt(pandalId || '1', 10);

  const { latitude, longitude, status, isLocating, requestLocation, refreshLocation, simulateKolkataLocation } =
    useGeolocation();

  const [pandal, setPandal] = useState<PandalDetailResponseDTO | null>(null);
  const [allAreaPandals, setAllAreaPandals] = useState<PandalResponseDTO[]>([]);
  const [distanceInfo, setDistanceInfo] = useState<DistanceResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Load pandal details & all city pandals for walkable circuit
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        setImgError(false);
        const [data, allPandals] = await Promise.all([
          getPandalDetail(id),
          getAllPandals(),
        ]);
        if (isMounted) {
          setPandal(data);
          setAllAreaPandals(allPandals);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load pandal details');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Load distance when coordinates are available
  useEffect(() => {
    let isMounted = true;
    async function loadDist() {
      if (latitude === null || longitude === null) return;
      try {
        setDistanceLoading(true);
        const dist = await getPandalDistance(id, latitude, longitude);
        if (isMounted) {
          setDistanceInfo(dist);
        }
      } catch (e) {
        console.warn('Failed to calculate distance for pandal', e);
      } finally {
        if (isMounted) setDistanceLoading(false);
      }
    }
    loadDist();
    return () => {
      isMounted = false;
    };
  }, [id, latitude, longitude]);

  // Nearby Walkable Pandals Circuit (under 1.5 - 2 km from THIS pandal)
  const nearbyCircuitPandals = useMemo(() => {
    if (!pandal || allAreaPandals.length === 0) return [];
    return allAreaPandals
      .filter((p) => p.id !== pandal.id)
      .map((p) => {
        const dist = calculateHaversineDistance(
          pandal.latitude,
          pandal.longitude,
          p.latitude,
          p.longitude
        );
        return {
          ...p,
          distanceKm: dist,
          walkingTimeMinutes: estimateWalkingTime(dist),
        };
      })
      .filter((p) => p.distanceKm <= 2.0) // within 2 km of this pandal
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3); // top 3 closest walkable pandals
  }, [pandal, allAreaPandals]);

  if (loading) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center py-12">
        <SankhaLoader
          variant="inline"
          size="lg"
          text="মণ্ডপ বিবরণ প্রস্তুত হচ্ছে..."
          subtext="শারদোৎসব ২০২৫ • আগমনী বার্তা"
        />
      </div>
    );
  }

  if (error || !pandal) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorBanner
          title="Pandal details could not be loaded"
          message={error || 'The requested pandal could not be found.'}
          onRetry={() => window.location.reload()}
        />
        <div className="text-center mt-4">
          <Link
            to="/pandals"
            className="text-xs font-semibold text-vermilion hover:underline inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Pandals Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;
  const proTip = getPandalProTip(pandal);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${pandal.name} - PujaPath Kolkata`,
        text: `Explore ${pandal.name} in ${pandal.areaName}, Kolkata on PujaPath!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1520px] mx-auto pb-40 md:pb-24 space-y-8">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/pandals"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal hover:text-vermilion transition-colors bg-ivory-surface border border-ivory-border px-3.5 py-2 rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Pandals</span>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal hover:text-vermilion transition-colors bg-ivory-surface border border-ivory-border px-3.5 py-2 rounded-xl shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Header Banner with Clean Non-Overlapping Overlay & Ambient Backdrop */}
      <div className="relative rounded-3xl overflow-hidden border border-ivory-border shadow-warm-md min-h-[240px] sm:min-h-[300px] md:min-h-[360px] bg-charcoal">
        {pandal.imageUrl && !imgError ? (
          <div className="relative w-full h-64 sm:h-76 md:h-88 lg:h-96 overflow-hidden">
            {/* Ambient blurred backdrop fill so aspect ratios fit seamlessly */}
            <img
              src={pandal.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-60"
              aria-hidden="true"
            />
            {/* Focused high-resolution banner image */}
            <img
              src={pandal.imageUrl}
              alt={pandal.name}
              className="relative w-full h-full object-cover object-center brightness-[0.85] contrast-[1.05]"
              onError={() => setImgError(true)}
            />
            {/* Multi-layer gradient overlays ensuring white text is 100% readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 via-55% to-charcoal/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/20 to-transparent pointer-events-none" />
          </div>
        ) : (
          <PandalFallbackGraphic name={pandal.name} variant="banner" />
        )}

        {/* Floating Banner Details (Single Source of Text) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-vermilion text-white font-semibold text-xs px-3 py-1 rounded-full shadow-xs">
              {pandal.areaName || 'South Kolkata'}
            </span>
            <span className="text-white/90 text-xs font-mono bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
              ID #{pandal.id}
            </span>
            {pandal.bestTimeToVisit && (
              <span className="bg-charcoal/70 backdrop-blur-md text-amber-300 text-xs font-medium px-2.5 py-0.5 rounded-full border border-amber-400/25">
                ⭐ {pandal.bestTimeToVisit}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md text-white">
            {pandal.name}
          </h1>

          <div className="flex items-center space-x-2 mt-1.5 text-xs sm:text-sm text-stone-200">
            <MapPin className="w-4 h-4 text-vermilion-light shrink-0" />
            <span className="drop-shadow-xs line-clamp-1">{pandal.address}</span>
          </div>
        </div>
      </div>

      {/* Live Distance Card */}
      <div className="bg-ivory-surface rounded-2xl border border-ivory-border p-5 sm:p-6 shadow-warm-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                Distance From You
              </span>
              {status === 'granted' && (
                <span className="inline-flex items-center space-x-1 text-[11px] text-leaf font-semibold bg-leaf/10 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
                  <span>Live GPS</span>
                </span>
              )}
            </div>

            {status === 'granted' && distanceInfo ? (
              <div>
                <div className="text-xl sm:text-2xl font-bold text-charcoal flex items-center space-x-2">
                  <span>You're {formatDistance(distanceInfo.distanceInKm)} away</span>
                </div>
                <div className="text-xs sm:text-sm text-charcoal-muted flex items-center space-x-2 mt-0.5">
                  <Footprints className="w-4 h-4 text-terracotta" />
                  <span>Approximately {formatWalkingTime(distanceInfo.walkingTimeMinutes)}</span>
                </div>
              </div>
            ) : status === 'granted' && distanceLoading ? (
              <p className="text-xs text-charcoal-muted animate-pulse">
                Calculating walking distance from your GPS...
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-charcoal-muted">
                  Enable device location to see exact walking distance and travel time to {pandal.name}.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {status === 'granted' ? (
              <button
                onClick={refreshLocation}
                disabled={isLocating || distanceLoading}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal hover:text-vermilion bg-ivory-warm hover:bg-stone-200/70 border border-ivory-border px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocating || distanceLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Location</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={requestLocation}
                  disabled={isLocating}
                  className="inline-flex items-center space-x-1.5 bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-warm-sm active:scale-95 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isLocating ? 'Locating...' : 'Enable Location'}</span>
                </button>
                <button
                  onClick={simulateKolkataLocation}
                  className="inline-flex items-center space-x-1 text-terracotta bg-terracotta-50 hover:bg-terracotta-100 border border-terracotta-200 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                >
                  <Compass className="w-3 h-3" />
                  <span>Kolkata Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: About Pandal + Best Time to Visit & Dynamic Pro-Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description (2 Cols) */}
        <div className="lg:col-span-2 bg-ivory-surface rounded-2xl border border-ivory-border p-6 shadow-warm-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-vermilion">
            <Info className="w-4 h-4" />
            <span>About The Pandal</span>
          </div>
          <h3 className="text-xl font-bold text-charcoal">
            Cultural Heritage & Theme Concept
          </h3>
          <p className="text-sm text-charcoal-muted leading-relaxed whitespace-pre-line">
            {pandal.description}
          </p>
          <div className="pt-3 border-t border-ivory-muted text-xs text-charcoal-subtle flex items-center space-x-2">
            <span>Geographic Coordinates:</span>
            <span className="font-mono">{pandal.latitude.toFixed(4)}° N, {pandal.longitude.toFixed(4)}° E</span>
          </div>
        </div>

        {/* Best Time To Visit + Dynamic Pro-Tip (1 Col) */}
        <div className="bg-gradient-to-br from-amber-50/80 via-ivory-surface to-orange-50/50 rounded-2xl border border-amber-200/70 p-6 shadow-warm-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-900">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Visiting Recommendation</span>
            </div>
            <h3 className="text-base font-bold text-charcoal">Best Time to Visit</h3>
            <div>
              <BestTimeBadge timeSlot={pandal.bestTimeToVisit} className="text-sm px-3 py-1.5" />
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Crowds peak between 8 PM and 1 AM. Early morning offers peaceful rituals and photography without long queues.
            </p>
          </div>

          {/* DYNAMIC PRO-TIP (Tailored for each specific pandal) */}
          <div className="p-3.5 bg-white/80 rounded-xl border border-amber-200/70 text-xs text-charcoal-soft font-medium space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-900 font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Pandal Insider Tip:</span>
            </div>
            <p className="text-charcoal-muted leading-relaxed">
              {proTip}
            </p>
          </div>
        </div>
      </div>

      {/* Walkable Pandals Circuit (Under 1 - 2 km from THIS pandal) */}
      {nearbyCircuitPandals.length > 0 && (
        <div className="bg-ivory-surface rounded-2xl border border-terracotta/30 p-6 shadow-warm-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-ivory-muted pb-3">
            <div className="flex items-center space-x-2">
              <Route className="w-5 h-5 text-vermilion" />
              <h2 className="text-lg sm:text-xl font-bold text-charcoal">
                Nearby Pandals (Walkable Circuit • হাঁটার দূরত্বে আরও পুজো)
              </h2>
            </div>
            <span className="text-xs font-semibold text-terracotta">
              Within 2 km of {pandal.name}
            </span>
          </div>

          <p className="text-xs text-charcoal-muted">
            Visiting <strong>{pandal.name}</strong>? Hop directly to these neighboring pandals on foot without hailing a cab:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {nearbyCircuitPandals.map((circuitPandal) => (
              <div
                key={circuitPandal.id}
                className="bg-ivory-warm/60 border border-ivory-border hover:border-terracotta/40 rounded-2xl p-4 transition-all duration-200 shadow-xs hover:shadow-warm-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    <Footprints className="w-3 h-3 text-leaf" />
                    <span>{formatDistance(circuitPandal.distanceKm)} from here</span>
                    <span className="opacity-40">•</span>
                    <span>{formatWalkingTime(circuitPandal.walkingTimeMinutes)}</span>
                  </div>

                  <h4 className="text-base font-bold text-charcoal hover:text-vermilion transition-colors">
                    {circuitPandal.name}
                  </h4>

                  <p className="text-xs text-charcoal-muted line-clamp-1">
                    📍 {circuitPandal.address}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-ivory-muted flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-subtle">
                    {circuitPandal.bestTimeToVisit || 'Evening'}
                  </span>
                  <Link
                    to={`/pandals/${circuitPandal.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-vermilion bg-vermilion/5 hover:bg-vermilion/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Hop to Pandal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Metro Stations */}
      <div className="bg-ivory-surface rounded-2xl border border-ivory-border p-6 shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between border-b border-ivory-muted pb-3">
          <div className="flex items-center space-x-2">
            <Train className="w-5 h-5 text-vermilion" />
            <h2 className="text-lg sm:text-xl font-bold text-charcoal">
              Nearby Metro Stations
            </h2>
          </div>
          <span className="text-xs text-charcoal-subtle">
            {pandal.nearbyMetros.length} transit links
          </span>
        </div>

        {pandal.nearbyMetros.length === 0 ? (
          <p className="text-xs text-charcoal-muted py-4">
            No specific metro stations mapped for this pandal yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pandal.nearbyMetros.map((metro) => {
              const lines = parseStationLines(metro.line);

              return (
                <div
                  key={metro.id}
                  className="bg-ivory-warm/60 border border-ivory-border hover:border-terracotta/40 rounded-xl p-4 transition-all duration-200 shadow-xs hover:shadow-warm-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {lines.map((l) => {
                          const m = getMetroLineMeta(l);
                          return (
                            <span
                              key={l}
                              className="text-[10px] text-white px-2 py-0.5 rounded-full font-bold shadow-xs"
                              style={{ backgroundColor: m.hex }}
                            >
                              {l}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-charcoal">
                      {metro.name}
                    </h4>

                    {(metro.distanceKm != null || metro.walkingTimeMinutes != null) && (
                      <div className="flex items-center space-x-1.5 text-xs text-charcoal-muted pt-1">
                        <Footprints className="w-3.5 h-3.5 text-terracotta" />
                        <span className="font-semibold text-charcoal">
                          {formatDistance(metro.distanceKm)}
                        </span>
                        <span className="opacity-40">•</span>
                        <span>{formatWalkingTime(metro.walkingTimeMinutes)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-ivory-muted flex items-center justify-between">
                    <Link
                      to={`/metro/stations/${metro.id}`}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-vermilion hover:underline"
                    >
                      <span>Station Pandals</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Sticky Action Footer (Properly positioned above bottom navigation on mobile) */}
      <div className="fixed bottom-20 md:bottom-6 left-0 right-0 px-4 z-40 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center space-x-2 bg-vermilion hover:bg-vermilion-dark text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-98 border border-white/20"
          >
            <Navigation className="w-5 h-5 text-white" />
            <span>Navigate to {pandal.name}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
