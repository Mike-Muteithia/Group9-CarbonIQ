/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ["Jost", "sans-serif"],
      },
      colors: {
        primary: "#19a64d",       // main green
        secondary: "#3bb043",     // lighter green
        accent: "#6eef89",        // accent/hover green
        darkgreen: "#23683a",
        lightgreen: "#95ff9d",
        graytext: "#6e6e6e",
      },
    },
  },
  plugins: [],
};
