/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6D5EF5',
          accent: '#A78BFA',
        },
        surface: {
          page: '#F5F7FB',
          card: '#FFFFFF',
        },
        text: {
          primary: '#172033',
          muted: '#667085',
        },
        type: {
          feature: '#0F9D78',
          bug: '#E05252',
        },
        due: {
          safe: '#D9F3E8',
          warning: '#FFF0C2',
          overdue: '#FAD7D7',
          neutral: '#E8ECF2',
        },
      },
    },
  },
  plugins: [],
};
