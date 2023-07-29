/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/src/html/*.html", "./public/src/js/*.js"],
  theme: {
    extend: {
      colors: {
        'background-color': '#121212',
        'primary-color': '#181818',
      },
      fontFamily: {
        formula1: ["Formula1", "sans-serif"],
      },
    },
  },
  plugins: [],
}
