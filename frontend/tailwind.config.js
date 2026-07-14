/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0F172A',
          900: '#0D1421',
        },
        turquoise: '#2DD4BF',
        'turquoise-dark': '#14B8A6',
        blue: '#60A5FA',
        amber: '#FBB024',
        danger: '#EF4444',
        morocco: {
          red: '#C1272D',
          green: '#006233',
          copper: '#B87333',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'zellige-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%231E293B' stroke-width='0.5'/%3E%3Cpath d='M30 10L50 30L30 50L10 30L30 10z' fill='none' stroke='%231E293B' stroke-width='0.3'/%3E%3C/svg%3E\")",
        'geometric-glow': "radial-gradient(ellipse 800px 600px at 50% 0%, rgba(45,212,191,0.06), transparent)",
      },
    },
  },
  plugins: [],
};
