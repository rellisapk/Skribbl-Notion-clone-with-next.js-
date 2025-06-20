/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        pinkish: '#ffdde1',
        babyblue: '#d0e7ff',
      },
    },
  },
  plugins: [],
}

