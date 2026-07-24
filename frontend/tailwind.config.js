/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Control room" palette — dark, low-chroma surfaces so severity
        // and status colors (the data that actually matters) stay the
        // only saturated things on screen.
        base: {
          bg: '#0A0E14',
          surface: '#12161F',
          surface2: '#1A1F2B',
          border: '#242A38',
        },
        ink: {
          primary: '#E6E9F0',
          muted: '#8891A5',
          faint: '#5B6377',
        },
        signal: {
          critical: '#F0465B',
          high: '#F0465B',
          medium: '#F5A623',
          low: '#38BDF8',
          resolved: '#34D399',
          investigating: '#F5A623',
          unresolved: '#F0465B',
          accent: '#5B8DEF',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
