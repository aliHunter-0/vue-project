import tailwindForm from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  plugins: [tailwindForm],

  content: ['./index.html', './src/**/*.vue'],
  theme: {
    extend: {}
  }
};
