/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        royal: { DEFAULT: '#17499A', 600: '#123b7c', 700: '#0e2f63' },
        gold: { DEFAULT: '#D6B34E', light: '#E8CE7E', dark: '#B8952F' },
        navy: { DEFAULT: '#09152B', 800: '#0d1d3a', 700: '#122448' },
        sand: '#F7F7F5',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E8CE7E 0%, #D6B34E 45%, #B8952F 100%)',
      },
      boxShadow: {
        gold: '0 10px 30px -10px rgba(214,179,78,0.55)',
        card: '0 18px 40px -18px rgba(9,21,43,0.35)',
      },
    },
  },
  plugins: [],
};
