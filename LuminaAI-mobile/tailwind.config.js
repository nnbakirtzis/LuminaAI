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
        sand: '#b38f6f',
        obsidian: '#161616',
        primary: '#b38f6f',
        dark: '#161616',
        surface: '#FDFBF7',
      },
      fontFamily: {
        sans: ['PTSerif_400Regular'],
        serif: ['PTSerif_400Regular'],
        'serif-bold': ['PTSerif_700Bold'],
        'serif-italic': ['PTSerif_400Regular_Italic'],
        'serif-bold-italic': ['PTSerif_700Bold_Italic'],
      },
    },
  },
  plugins: [],
};
