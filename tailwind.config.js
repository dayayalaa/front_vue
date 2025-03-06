/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,vue}',  
    './public/**/*.{html,js}',   
  ],
  theme: {
    extend: {
      fontFamily: {
        sableklish: ['Sableklish', 'sans-serif'],
        sitka: ['SitkaB', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};
