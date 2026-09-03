/** @type {import('tailwindcss').Config} */
// O app usa o Tailwind só pelo preflight (o reset de base). O layout inteiro
// mora em src/index.css, em classes `cat-*` — por isso não há tema estendido
// aqui além da fonte.
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rotunda', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
