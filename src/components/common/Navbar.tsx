import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DurgaEyeIcon } from './DurgaEyeIcon';
import { useGeolocation } from '../../hooks/useGeolocation';
import { MapPin, RefreshCw, Compass } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { status, isLocating, requestLocation, refreshLocation, simulateKolkataLocation } =
    useGeolocation();

  const navLinks = [
    { name: 'Home', path: '/', labelBengali: 'হোম' },
    { name: 'Pandals', path: '/pandals', labelBengali: 'পুজো প্যান্ডেল' },
    { name: 'Kolkata Metro', path: '/metro', labelBengali: 'মেট্রো রুট' },
    { name: 'Puja Near You', path: '/nearby', labelBengali: 'কাছের পুজো' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory-warm/95 backdrop-blur-md border-b border-ivory-border shadow-warm-sm transition-all">
      {/* Subtle Top Red Accent Stripe (লাল পাড়) */}
      <div className="h-1 bg-gradient-to-r from-vermilion-deep via-vermilion to-terracotta" />

      <div className="max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Cultural Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-ivory-surface border border-terracotta/20 flex items-center justify-center shadow-warm-sm group-hover:scale-105 transition-transform">
              <DurgaEyeIcon size={32} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-2">
                <span className="text-xl md:text-2xl font-bold tracking-tight text-charcoal font-sans group-hover:text-vermilion transition-colors">
                  Puja<span className="text-vermilion">Path</span>
                </span>
                <span className="hidden lg:inline-block text-xs font-semibold uppercase tracking-wider text-terracotta bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
                  Kolkata
                </span>
              </div>
              <span className="text-[11px] md:text-xs text-charcoal-muted font-bengali font-medium tracking-wide">
                পুজোর কলকাতা, আপনার পথে
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex flex-col items-center justify-center relative',
                    active
                      ? 'text-vermilion-dark font-semibold bg-vermilion/5'
                      : 'text-charcoal-soft hover:text-charcoal hover:bg-ivory-muted/60'
                  )}
                >
                  <span>{link.name}</span>
                  <span className="text-[10px] text-charcoal-subtle font-bengali -mt-0.5 opacity-80">
                    {link.labelBengali}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-vermilion rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Location Action Pill */}
          <div className="flex items-center space-x-2">
            {status === 'granted' ? (
              <div className="flex items-center bg-ivory-surface border border-leaf/30 rounded-full px-3 py-1.5 shadow-sm">
                <span className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-leaf"></span>
                </span>
                <span className="text-xs font-medium text-charcoal hidden sm:inline">
                  Location Active
                </span>
                <span className="text-xs font-medium text-charcoal sm:hidden">Active</span>
                <button
                  onClick={refreshLocation}
                  disabled={isLocating}
                  title="Refresh GPS location"
                  className="ml-2 text-charcoal-subtle hover:text-vermilion disabled:opacity-50 transition-colors p-0.5"
                >
                  <RefreshCw className={cn('w-3.5 h-3.5', isLocating && 'animate-spin')} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={requestLocation}
                  disabled={isLocating}
                  className="flex items-center space-x-1.5 bg-vermilion text-white text-xs font-medium px-3.5 py-2 rounded-full shadow-warm-sm hover:bg-vermilion-dark active:scale-95 transition-all disabled:opacity-60"
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
                </button>
                <button
                  onClick={simulateKolkataLocation}
                  title="Explore South Kolkata location"
                  className="hidden lg:flex items-center space-x-1 text-[11px] font-medium text-terracotta hover:text-vermilion bg-terracotta-50 hover:bg-terracotta-100 border border-terracotta-200 px-2.5 py-1.5 rounded-full transition-colors"
                >
                  <Compass className="w-3 h-3" />
                  <span>South Kol Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

