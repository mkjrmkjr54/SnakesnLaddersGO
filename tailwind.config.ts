import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        casino: {
          950: '#07060b',
          900: '#0e0b18',
          800: '#151226',
          700: '#1d1a35',
          600: '#2a2548',
          500: '#3b3361',
          400: '#5c5187',
          300: '#8676b3',
          200: '#b4a9da',
          100: '#dfd8f3'
        },
        neon: {
          pink: '#ff47d3',
          blue: '#3ce7ff',
          green: '#4bffb1',
          gold: '#f8c964'
        }
      },
      boxShadow: {
        neon: '0 0 20px rgba(60, 231, 255, 0.35), 0 0 40px rgba(255, 71, 211, 0.25)',
        glow: '0 0 24px rgba(248, 201, 100, 0.4)'
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif']
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 5s linear infinite',
        float: 'float 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
