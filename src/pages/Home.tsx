import React from 'react';
import { Link } from 'react-router-dom';
import { DurgaCountdown } from '../components/common/DurgaCountdown';
import { AlpanaDivider } from '../components/common/AlpanaMotif';
import { ArrowRight, Train, Route, MapPin, Compass } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16 pb-16 pt-2 sm:pt-4 px-2 sm:px-4">
      {/* 1. Hero Section: The Single Calm Visual Centerpiece */}
      <section className="text-center space-y-6 sm:space-y-8">
        {/* Prominent Artistic Portrait of Goddess Durga */}
        <div className="relative mx-auto w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-warm-md border border-ivory-border dark:border-obsidian-300 bg-ivory-surface dark:bg-obsidian-50">
          <img
            src="/goddess_durga.jpg"
            alt="Maa Durga - Kolkata Durga Puja"
            className="w-full h-72 sm:h-96 md:h-[440px] object-cover object-[center_28%] transition-transform duration-700 hover:scale-[1.02]"
            loading="eager"
          />
          {/* Subtle bottom gradient to blend into the card frame */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Minimal authentic watermark at bottom edge */}
          <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex items-center justify-between text-white/90 text-xs pointer-events-none">
            <span className="font-bengali tracking-wide font-medium drop-shadow-sm text-[11px] sm:text-xs text-amber-200">
              শারদোৎসব ২০২৬
            </span>
            <span className="text-[11px] sm:text-xs text-stone-300 drop-shadow-sm font-sans">
              Kolkata, West Bengal
            </span>
          </div>
        </div>

        {/* Hero Copy: Authentic, Short, Minimalist */}
        <div className="space-y-3 max-w-xl mx-auto px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-bengali text-charcoal dark:text-stone-100 tracking-tight leading-snug">
            পুজোর কলকাতা, আপনার পথে
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-charcoal-muted dark:text-stone-300 font-sans leading-relaxed">
            Discover pandals, find nearby places, and plan your Puja Parikrama.
          </p>
        </div>

        {/* Primary CTA: The Single Strongest Action */}
        <div className="pt-1 flex flex-col items-center justify-center space-y-4">
          <Link
            to="/pandals"
            className="inline-flex items-center space-x-2.5 bg-vermilion hover:bg-vermilion-dark text-white text-sm sm:text-base font-semibold px-8 sm:px-10 py-3 sm:py-3.5 rounded-full shadow-warm-sm hover:shadow-warm-md active:scale-98 transition-[colors,box-shadow,transform]"
          >
            <span>Explore Pandals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Compact, Restrained Durga Puja Countdown */}
          <DurgaCountdown className="pt-1" />
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="flex items-center justify-center py-1">
        <div className="h-px w-24 bg-ivory-border dark:bg-obsidian-300" />
        <span className="px-3 text-vermilion/50 dark:text-amber-400/50 text-xs">🪔</span>
        <div className="h-px w-24 bg-ivory-border dark:bg-obsidian-300" />
      </div>

      {/* 2. Secondary Discovery: Explore PujaPath (Minimal 2x2 Grid) */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-charcoal dark:text-stone-100 tracking-tight">
            Explore PujaPath
          </h2>
          <p className="text-xs text-charcoal-subtle dark:text-stone-400 font-bengali">
            সহজে পুজো পরিক্রমার প্রয়োজনীয় সুবিধাসমূহ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 max-w-2xl mx-auto">
          {/* Feature 1: Metro Routes */}
          <Link
            to="/metro"
            className="group flex items-start space-x-3.5 p-4 sm:p-4.5 rounded-2xl bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 hover:border-blue-400/50 dark:hover:border-blue-400/40 hover:bg-white dark:hover:bg-obsidian-100 transition-all shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Train className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-charcoal dark:text-stone-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Metro Routes
                </h3>
                <span className="text-[11px] font-bengali text-charcoal-subtle dark:text-stone-400">
                  • মেট্রো রুট
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-stone-300 leading-relaxed">
                Check metro stations, line maps, and walking times to beat festive traffic.
              </p>
            </div>
          </Link>

          {/* Feature 2: Puja Parikrama */}
          <Link
            to="/routes"
            className="group flex items-start space-x-3.5 p-4 sm:p-4.5 rounded-2xl bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 hover:border-amber-400/50 dark:hover:border-amber-400/40 hover:bg-white dark:hover:bg-obsidian-100 transition-all shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Route className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-charcoal dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Puja Parikrama
                </h3>
                <span className="text-[11px] font-bengali text-charcoal-subtle dark:text-stone-400">
                  • পুজো পরিক্রমা
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-stone-300 leading-relaxed">
                Explore handpicked heritage and award-winning theme puja circuits.
              </p>
            </div>
          </Link>

          {/* Feature 3: Puja Near You */}
          <Link
            to="/nearby"
            className="group flex items-start space-x-3.5 p-4 sm:p-4.5 rounded-2xl bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 hover:border-leaf/50 dark:hover:border-leaf/40 hover:bg-white dark:hover:bg-obsidian-100 transition-all shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-leaf/10 dark:bg-leaf/20 text-leaf flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-charcoal dark:text-stone-100 group-hover:text-leaf transition-colors">
                  Puja Near You
                </h3>
                <span className="text-[11px] font-bengali text-charcoal-subtle dark:text-stone-400">
                  • কাছের পুজো
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-stone-300 leading-relaxed">
                Find pandals nearest to you with live GPS walking directions.
              </p>
            </div>
          </Link>

          {/* Feature 4: Make Your Own Route */}
          <Link
            to="/routes"
            className="group flex items-start space-x-3.5 p-4 sm:p-4.5 rounded-2xl bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 hover:border-vermilion/50 dark:hover:border-vermilion/40 hover:bg-white dark:hover:bg-obsidian-100 transition-all shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-vermilion/10 dark:bg-vermilion/20 text-vermilion flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-charcoal dark:text-stone-100 group-hover:text-vermilion transition-colors">
                  Make Your Own Route
                </h3>
                <span className="text-[11px] font-bengali text-charcoal-subtle dark:text-stone-400">
                  • নিজের রুট
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-stone-300 leading-relaxed">
                Pick your favorite pandals and generate a custom hopping itinerary.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Quiet Bengali Brand Footer Accent */}
      <div className="text-center pt-4 space-y-2">
        <AlpanaDivider className="opacity-40" />
        <p className="text-[11px] font-bengali text-charcoal-subtle dark:text-stone-500 tracking-wide">
          PujaPath • পুজোর কলকাতা, আপনার পথে
        </p>
      </div>
    </div>
  );
};
