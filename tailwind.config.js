/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#161B22',
        border: '#30363D',
        accent: '#10B981',
        primary: '#3B82F6',
      }
    },
  },
  plugins: [],
}
