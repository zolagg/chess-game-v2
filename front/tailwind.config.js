/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4a90e2',
        'secondary': '#34495e',
        'accent': '#2ecc71',
        'background': '#f8fafc',
        'surface': '#ffffff',
        'error': '#e74c3c',
        'text': {
          'primary': '#2c3e50',
          'secondary': '#7f8c8d'
        }
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out'
      }
    },
  },
  plugins: [],
} 