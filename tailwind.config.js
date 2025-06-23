/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify files where Tailwind should scan for classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can extend Tailwind's default theme here
      colors: {
        'pink': '#fe009c',
        'yellow': '#ffee07',
        'black': '#100e0e',
        'orange': '#f15204',
        'lightorange': '#f18104',
        'twitch': '#6441a5',
        'youtube': '#FF0000',
        'lightblue' : '#04a3f1'
      },
      fontFamily: {
        'montserrat': ['"Montserrat"', 'cursive'],
      },
    },
  },
  plugins: [],
}
