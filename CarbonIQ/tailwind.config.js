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
        carbonGreen: '#16A34A',
        carbonYellow: '#FFFFA1',
        carbonGray: '#F5F5F5',
        carbonText: '#1F2937',
      },
      spacing: {
        'sidebar': '16rem',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
}
