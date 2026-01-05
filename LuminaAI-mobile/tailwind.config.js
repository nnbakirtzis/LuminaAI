/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#F0F2FF',
          100: '#E0E4FF',
          200: '#C7CEFE',
          300: '#A5AEFC',
          400: '#818AF8',
          500: '#636AF1',
          600: '#4F54E5',
          700: '#4347CA',
          800: '#363A64', // Main Deep Indigo
          900: '#21243D',
          950: '#14172B',
        },
        aqua: {
          50: '#F0FDFA',
          100: '#C4E8E9', // Main Soft Aqua
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        slate: {
          50: '#F8FAFC',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['System'],
        display: ['System'],
      },
    },
  },
  plugins: [],
};
