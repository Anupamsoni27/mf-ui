/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Add any dynamic classes that might be purged
    'bg-gray-50',
    'text-gray-900',
    'text-gray-500',
    'hover:bg-gray-50',
    'border-gray-200',
    'bg-white',
    'shadow',
    'rounded-lg',
    'px-6',
    'py-4',
    'text-sm',
    'font-medium',
    'text-green-600',
    'text-red-600',
    'text-indigo-600',
    'hover:text-indigo-900'
  ]
}
