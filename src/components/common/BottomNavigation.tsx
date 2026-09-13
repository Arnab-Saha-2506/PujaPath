import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Train, MapPin, Route as RouteIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useRoutePlanner } from '../../context/RouteContext';

export const BottomNavigation: React.FC = () => {
  const { selectedPandalIds } = useRoutePlanner();

  const tabs = [
    {
      to: '/',
      label: 'Home',
      bengali: 'হোম',
      icon: Home,
    },
    {
      to: '/pandals',
      label: 'Pandals',
      bengali: 'প্যান্ডেল',
      icon: Compass,
    },
    {
      to: '/routes',
      label: 'Planner',
      bengali: 'রুট প্ল্যান',
      icon: RouteIcon,
      badge: selectedPandalIds.length,
    },
    {
      to: '/metro',
      label: 'Metro',
      bengali: 'মেট্রো',
      icon: Train,
    },
    {
      to: '/nearby',
      label: 'Nearby',
      bengali: 'কাছের পুজো',
      icon: MapPin,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ivory-surface dark:bg-obsidian-50/95 backdrop-blur-lg border-t border-ivory-border dark:border-obsidian-300 shadow-lg transition-transform duration-200 pb-safe"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center relative py-1 text-xs font-medium transition-colors select-none',
                  isActive
                    ? 'text-vermilion font-semibold'
                    : 'text-charcoal-subtle dark:text-stone-400 hover:text-charcoal dark:hover:text-stone-100'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'p-1 rounded-full transition-colors duration-200 relative',
                      isActive ? 'bg-vermilion/10 scale-110' : ''
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {Boolean(tab.badge && tab.badge > 0) && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-vermilion text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] leading-tight mt-0.5">{tab.label}</span>
                  <span className="text-[9px] font-bengali text-charcoal-subtle dark:text-stone-400 leading-none opacity-80">
                    {tab.bengali}
                  </span>
                  {isActive && (
                    <span className="absolute top-0 w-8 h-1 bg-vermilion rounded-b-full shadow-sm" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

