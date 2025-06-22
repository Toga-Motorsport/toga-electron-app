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
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set Inter as the default sans-serif font
      },
    },
  },
  plugins: [],
}
