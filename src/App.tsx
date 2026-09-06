import React from 'react';
import { LocationProvider } from './context/LocationContext';
import { Navbar } from './components/common/Navbar';
import { BottomNavigation } from './components/common/BottomNavigation';
import { AppRoutes } from './routes/AppRoutes';
import { DurgaEyeIcon } from './components/common/DurgaEyeIcon';
import { BengaliSideBorder } from './components/common/BengaliSideBorder';
import { PageTransition } from './components/common/PageTransition';
import { Link } from 'react-router-dom';

function App() {
  return (
    <LocationProvider>
      <div className="min-h-screen flex flex-col bg-alpana-pattern text-charcoal relative">
        {/* Sacred Sankha Page Transition Overlay */}
        <PageTransition />

        {/* Bengali Cultural Side Border Runners (Desktop Only) */}
        <BengaliSideBorder side="left" />
        <BengaliSideBorder side="right" />

        {/* Top Desktop Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8">
          <AppRoutes />
        </main>

        {/* Bengali Cultural Footer */}
        <footer className="bg-ivory-surface border-t border-ivory-border mt-auto pt-10 pb-20 md:pb-10">
          <div className="max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Col */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-ivory border border-terracotta/20 flex items-center justify-center shadow-xs">
                    <DurgaEyeIcon size={26} />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-charcoal">
                    Puja<span className="text-vermilion">Path</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-charcoal-muted max-w-md leading-relaxed">
                  Crafted for exploring the magic of Kolkata Durga Puja. Discover famous pandals,
                  calculate walking times, and navigate with Kolkata Metro lines.
                </p>
                <div className="text-xs font-bengali text-terracotta font-semibold">
                  "পুজো ঘুরুন, কলকাতাকে নতুন করে দেখুন"
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Quick Navigation
                </h4>
                <ul className="space-y-1.5 text-xs text-charcoal-muted">
                  <li>
                    <Link to="/" className="hover:text-vermilion transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/pandals" className="hover:text-vermilion transition-colors">
                      South Kolkata Pandals (27+)
                    </Link>
                  </li>
                  <li>
                    <Link to="/metro" className="hover:text-vermilion transition-colors">
                      Kolkata Metro Map & Lines
                    </Link>
                  </li>
                  <li>
                    <Link to="/nearby" className="hover:text-vermilion transition-colors">
                      Pandals Near You
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Transit & Culture */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Kolkata Transit
                </h4>
                <ul className="space-y-1.5 text-xs text-charcoal-muted">
                  <li>
                    <Link
                      to="/metro/lines/Blue%20Line"
                      className="hover:text-[#0072CE] transition-colors"
                    >
                      🔵 Blue Line (Dakshineswar - Kavi Subhash)
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/metro/lines/Green%20Line"
                      className="hover:text-[#009A44] transition-colors"
                    >
                      🟢 Green Line (Howrah - Sector V)
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/metro/lines/Purple%20Line"
                      className="hover:text-[#7D3F98] transition-colors"
                    >
                      🟣 Purple Line (Joka - Majerhat)
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/metro/lines/Orange%20Line"
                      className="hover:text-[#ED6B00] transition-colors"
                    >
                      🟠 Orange Line (Garia - Ruby)
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-ivory-muted flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-subtle">
              <div className="flex items-center space-x-1.5">
                <span>Designed with authentic Bengali aesthetics for Sharadotsav 2026</span>
              </div>
              <div className="text-[11px]">
                Kolkata Durga Puja &copy; 2026 • UNESCO Intangible Cultural Heritage
              </div>
            </div>
          </div>
        </footer>

        {/* Mobile Fixed Bottom Navigation Bar (< 768px) */}
        <BottomNavigation />
      </div>
    </LocationProvider>
  );
}

export default App;

