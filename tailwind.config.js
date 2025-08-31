/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0065BD', // Thapar blue
        secondary: '#FFD100', // Thapar yellow
        neutral: {
          50: '#FFFFFF',
          100: '#F5F5F5',
          900: '#333333',
        }
      },
    },
  },
  plugins: [],
}
