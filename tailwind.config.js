/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#050505',
        surface: '#111111',
        primary: '#F5B800', // Brand Yellow
        accent: '#FDE047', // Lighter Yellow/Gold
        'text-dim': '#A1A1AA', // Zinc 400
      }
    },
  },
  plugins: [],
}
