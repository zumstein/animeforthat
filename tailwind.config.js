/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:     '#0a0b0f',
        surface: '#14171f',
        panel:   '#1a1d28',
        border:  '#252836',
        red:     '#e8394a',
        soft:    '#8890b0',
        muted:   '#5a5f7a',
        offwhite:'#eef0ff',
      },
    },
  },
  plugins: [],
}
