import type { Config } from 'tailwindcss'

const config: Config = {
  // 'class' strategy = dark mode is toggled by adding 'dark' class on <html>
  // We control this with a toggle button — not the OS setting
  darkMode: 'class',

  // Tell Tailwind which files contain class names
  // It removes unused classes from the final CSS build (tree-shaking)
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        // Our primary brand color — used for buttons, links, highlights
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Visualization colors — used to color algorithm elements
        viz: {
          default: '#6366f1',  // default element
          active:  '#f59e0b',  // currently active element
          compare: '#ec4899',  // elements being compared
          sorted:  '#10b981',  // finalized/sorted elements
          pivot:   '#f97316',  // pivot in Quick Sort
          visited: '#8b5cf6',  // visited node in graph traversal
          path:    '#06b6d4',  // shortest path highlight
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },

      animation: {
        'fade-in':    'fadeIn 0.2s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },

  plugins: [],
}

export default config
