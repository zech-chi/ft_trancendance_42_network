/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        backgroundImage: {
            'gta': "url('/gta.jpeg')",
        },
      },
    },
    plugins: [
      require('tailwind-scrollbar'),
    ],
  };