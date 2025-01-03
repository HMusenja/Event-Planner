/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",'./index.html'],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 1.5s ease-out",
        pulse: "pulse 2s infinite",
        textGlow: "textGlow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(-20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
          
        },
        textGlow: {
          "0%, 100%": { filter: "brightness(1.5)" },
          "50%": { filter: "brightness(2)" },
        },
      },
    },
  },
  plugins: [],
};
