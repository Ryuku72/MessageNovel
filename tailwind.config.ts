import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        'card-l': '480px'
      }
    },
  },
  plugins: [],
} satisfies Config

