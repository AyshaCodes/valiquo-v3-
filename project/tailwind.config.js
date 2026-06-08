/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0F172A',
        },
        turquoise: '#2DD4BF',
        'turquoise-dark': '#14B8A6',
        blue: '#60A5FA',
        amber: '#FBB024',
        danger: '#EF4444',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
