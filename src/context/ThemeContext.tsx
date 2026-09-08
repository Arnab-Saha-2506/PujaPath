import React, { createContext, useContext, useState, useEffect ,useMemo} from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('pujapath_theme');
        return (stored === 'light' ? 'light' : 'dark');
    });

    useEffect(() => {
        const root = document.documentElement;
        const metaThemeColor = document.getElementById('meta-theme-color');

        // Suppress all CSS transitions during theme swap to avoid the
        // "every element animates at once" lag. Re-enable on next paint.
        root.classList.add('no-transition');

        if (theme === 'dark') {
            root.classList.add('dark');
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#090305');
        } else {
            root.classList.remove('dark');
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#FAF7F2');
        }
        localStorage.setItem('pujapath_theme', theme);

        // Two rAF calls: first lets the browser commit the class change,
        // second removes no-transition after the frame is painted.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                root.classList.remove('no-transition');
            });
        });
    }, [theme]);

    const toggleTheme = useMemo(() => {
        return () => {
            setTheme(prev => prev === 'dark' ? 'light' : 'dark');
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}