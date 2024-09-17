/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.js',  // Ajout de cette ligne pour inclure les fichiers JS
  ],
  theme: {
    extend: {
      colors: {
        'accent': '#8B5CF6', // Violet color
      },
      fontFamily: {
        'sans': ['Source Code Pro', 'sans-serif'],
      },
    },
  },
  safelist: [
    'text-green-500',
    'text-yellow-500',
    'text-orange-500',
    'text-red-500',
    'text-gray-500',
    'bg-accent',
    'px-2',
    'py-1',
    'rounded-full',
    'text-sm',
  ],
  variants: {
    extend: {},
  },
  plugins: [],
}

