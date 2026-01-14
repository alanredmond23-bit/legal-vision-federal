/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'legal-navy': '#1a365d',
        'legal-gold': '#d69e2e',
        'legal-red': '#c53030',
        'legal-green': '#276749',
      }
    },
  },
  plugins: [],
}
