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
        primary: {
          DEFAULT: '#0065BD',  // Thapar blue
          dark: '#0050A0',     // darker shade for hover
        },
        secondary: '#FFD100',  // Thapar yellow
        neutral: {
          50: '#FFFFFF',
          100: '#F5F5F5',
          900: '#333333',
        },
      },
      borderRadius: {
        xl: '1rem',
        lg: '0.75rem',
      },
      boxShadow: {
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
