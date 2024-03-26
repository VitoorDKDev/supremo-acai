/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans':['Ubuntu, sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/fundo.png')"
      }
    },
  },
  plugins: [],
}

