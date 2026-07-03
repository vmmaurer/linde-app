/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#b8ccff',
          300: '#86a9ff',
          400: '#4d7fff',
          500: '#1a55ff',
          600: '#0038e6',
          700: '#002db8',
          800: '#012488',
          900: '#011c6b',
          950: '#010f40',
        },
        glass: {
          50: '#f0f7ff',
          100: '#deeeff',
          200: '#b6dcff',
          300: '#75c2ff',
          400: '#2ea4ff',
          500: '#0088f5',
          600: '#0069cc',
          700: '#0054a6',
          800: '#004888',
          900: '#003c70',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(1, 24, 104, 0.25)',
        'glass-lg': '0 16px 64px 0 rgba(1, 24, 104, 0.35)',
        'card': '0 20px 60px rgba(1, 28, 107, 0.3)',
      }
    },
  },
  plugins: [],
}
