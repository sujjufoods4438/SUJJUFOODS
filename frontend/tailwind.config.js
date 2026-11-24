/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sujju: {
          green: {
            DEFAULT: '#174A36', // Primary deep tea green
            50: '#F2F7F4',
            100: '#E2ECE6',
            200: '#C4D9CD',
            300: '#9FBFA9',
            400: '#548767',
            500: '#174A36',
            600: '#133D2D',
            700: '#0E2E22',
            800: '#0A2018',
            900: '#05120D',
          },
          gold: {
            DEFAULT: '#C69A48', // Secondary warm gold
            50: '#FCF9F1',
            100: '#F7F0DD',
            200: '#EEDDB4',
            300: '#E4CA88',
            400: '#D5B25C',
            500: '#C69A48',
            600: '#A97E33',
            700: '#835F24',
            800: '#5F4419',
            900: '#3D2A0D',
          },
          cream: {
            DEFAULT: '#FAF8F1', // Background cream white
            50: '#FFFFFF',
            100: '#FAF8F1',
            200: '#F4EEDC',
            300: '#ECE3C4',
          },
          charcoal: '#1C2520',
          leaf: '#2E7D32',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
