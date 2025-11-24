/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Soft sakura-inspired primary palette
        primary: {
          50: '#fef5f8',
          100: '#fde8f0',
          200: '#fcd1e1',
          300: '#f9a8c5',
          400: '#f57fa9',
          500: '#ee5a8d',
          600: '#d94377',
          700: '#b3325f',
          800: '#8d284d',
          900: '#6b1f3a',
        },
        // Warm neutral grays
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Soft accent colors
        accent: {
          peach: '#ffd4c4',
          mint: '#c4f1d4',
          lavender: '#e4d4f4',
          sky: '#d4e4f4',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
