/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        chrono: {
          base: '#080A0F',
          surface: '#111520',
          surfaceElevated: '#192030',
          surfaceHighlight: '#222A40',
          amber: '#F59E0B',
          amberLight: '#FBBF24',
          amberDark: '#D97706',
          emerald: '#10B981',
          emeraldLight: '#34D399',
          coral: '#EF4444',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          borderProminent: 'rgba(255, 255, 255, 0.16)',
          textPrimary: '#F8FAFC',
          textSecondary: '#94A3B8',
          textTertiary: '#64748B',
        },
        zen: {
          bg: '#080A0F',
          card: '#111520',
          cardHover: '#192030',
          border: 'rgba(255, 255, 255, 0.08)',
          primary: '#F59E0B',
          primaryLight: '#FBBF24',
          amber: '#F59E0B',
          amberLight: '#FCD34D',
          emerald: '#10B981',
          emeraldLight: '#34D399',
          textMuted: '#94A3B8',
          textLight: '#F8FAFC',
        }
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
          '50%': { transform: 'scale(1.18)', opacity: '0.85' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 30px rgba(99, 102, 241, 0.7))' },
        }
      }
    },
  },
  plugins: [],
}
