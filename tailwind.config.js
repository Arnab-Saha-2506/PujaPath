/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vermilion: {
          light: '#EF4444',
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          deep: '#991B1B',
        },
        terracotta: {
          50: '#FDF7F5',
          100: '#FBECE8',
          200: '#F7D7CE',
          300: '#EEB5A5',
          400: '#DE8871',
          500: '#C25E43',
          DEFAULT: '#C25E43',
          600: '#AB4C32',
          700: '#8E3C26',
          800: '#753322',
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          warm: '#FDFBF7',
          surface: '#FFFFFF',
          card: '#FCFAF7',
          muted: '#F3ECE2',
          border: '#E8DED1',
        },
        charcoal: {
          DEFAULT: '#18181B',
          soft: '#27272A',
          muted: '#52525B',
          subtle: '#71717A',
        },
        brass: {
          DEFAULT: '#D97706',
          light: '#F59E0B',
          dark: '#B45309',
        },
        leaf: {
          DEFAULT: '#15803D',
          light: '#16A34A',
          dark: '#166534',
        },
        metro: {
          blue: '#0072CE',
          green: '#009A44',
          purple: '#7D3F98',
          orange: '#ED6B00',
          yellow: '#EAB308',
        },
        // Dark theme surfaces with warm blackish-red undertones
        obsidian: {
          DEFAULT: '#090305',
          50: '#140608',
          100: '#19080B',
          200: '#220B0F',
          300: '#311217',
          400: '#481B22',
          500: '#642530',
        },
        blood: {
          DEFAULT: '#7F1D1D',
          light: '#991B1B',
          dark: '#3A0609',
          deep: '#200407',
        }
      },
      backgroundImage: {
        'dark-gradient': 'radial-gradient(ellipse at 50% 20%, #2A080E 0%, #1B0509 55%, #090305 100%)',
        'blackish-red': 'linear-gradient(145deg, #0A0305 0%, #1B0509 45%, #2A080F 75%, #0A0305 100%)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px 0 rgba(194, 94, 67, 0.08), 0 1px 2px -1px rgba(194, 94, 67, 0.08)',
        'warm-md': '0 4px 6px -1px rgba(194, 94, 67, 0.1), 0 2px 4px -2px rgba(194, 94, 67, 0.08)',
        'warm-lg': '0 10px 15px -3px rgba(194, 94, 67, 0.12), 0 4px 6px -4px rgba(194, 94, 67, 0.08)',
      },
    },
  },
  plugins: [],
}


