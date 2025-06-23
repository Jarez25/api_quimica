// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-expand': {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-expand': 'fade-expand 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};
