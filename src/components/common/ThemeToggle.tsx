import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            type="button"
            className="inline-flex items-center space-x-1.5 bg-ivory-surface dark:bg-obsidian-50 border border-ivory-border dark:border-obsidian-300 text-charcoal-soft dark:text-amber-200 text-xs font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl shadow-xs dark:shadow-[0_0_15px_rgba(127,29,29,0.35)] transition-[colors,box-shadow] hover:shadow-warm-md hover:border-vermilion/40 dark:hover:border-amber-400/40 active:scale-95 cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'white/light' : 'blackish-red dark'} theme`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
            {theme === 'dark' ? (
                <>
                    <Sun className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                    <span className="hidden sm:inline font-medium">Light Mode</span>
                </>
            ) : (
                <>
                    <Moon className="w-4 h-4 text-vermilion shrink-0" />
                    <span className="hidden sm:inline font-medium">Dark Mode</span>
                </>
            )}
        </button>
    );
};