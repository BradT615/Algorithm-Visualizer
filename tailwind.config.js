/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        customDarkBlue: '#11162a',
        customBlue: '#182246',
        customLightBlue: '#6757f8',
        customPink: '#fd40c8',
        customGray: '#91a4ad',
        customOffWhite: '#f8ffff',
        customPurple: '#8651f1',
        customCyberRed: '#ff2a6d',
        customCyberOffWhite: '#d1f7ff',
        customCyberLightBlue: '#05d9e8',
        customCyberBlue: '#005678',
        customCyberDarkBlue: '#01012b'
      }
    },
  },
  plugins: [],
}
