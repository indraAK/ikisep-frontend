/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        green: {
          primary: "#00880D",
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
