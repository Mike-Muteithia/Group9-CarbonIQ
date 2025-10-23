/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      },
      colors: {
        carbonGreen: '#16A34A',     // Impact summary, buttons
        carbonYellow: '#FFFFA1',    // CoachCard background
        carbonGray: '#F5F5F5',      // Page background
        carbonText: '#1F2937',      // Default text
      },
      spacing: {
        'sidebar': '16rem',         // Sidebar width
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
}
