/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        './pages/**/*.{js,ts,jsx,tsx}',
    './_components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        light: '#A64D79',
        dark : '#3B1C32',
        bg: '#1A1A1D',
        gray: "#252529"
      }
    },
  },
  plugins: [],
}

