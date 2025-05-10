/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        primary: {
          light: '#3B82F6', // blue-500
          DEFAULT: '#2563EB', // blue-600
          dark: '#1D4ED8', // blue-700
        },
        secondary: {
          light: '#10B981', // green-500
          DEFAULT: '#059669', // green-600
          dark: '#047857', // green-700
        },
        // Dark theme colors
        dark: {
          bg: '#1F2937', // gray-800
          card: '#374151', // gray-700
          text: '#F3F4F6', // gray-100
          border: '#4B5563', // gray-600
        },
        // Blue theme colors
        blue: {
          bg: '#EFF6FF', // blue-50
          card: '#DBEAFE', // blue-100
          text: '#1E40AF', // blue-800
          border: '#93C5FD', // blue-300
        },
        // Green theme colors
        green: {
          bg: '#ECFDF5', // green-50
          card: '#D1FAE5', // green-100
          text: '#065F46', // green-800
          border: '#6EE7B7', // green-300
        },
      },
    },
  },
  plugins: [],
} 