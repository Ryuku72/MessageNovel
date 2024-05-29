import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      minWidth: {
        'card-l': '480px',
        'c-600': '600px',
        'c-800': '800px',
        button: '145px'
      },
      width: {
        'card-l': '480px',
        'c-600': '600px',
        'c-800': '800px'
      },
      maxWidth: {
        'card-l': '480px',
        'c-600': '600px',
        'c-800': '800px',
        button: '145px'
      },
      colors: {
        'pastel-black': '#D3D3D3',
        'pastel-red': '#FF9999',
        'pastel-brown': '#FFCCCC',
        'pastel-orange': '#FFDAB9',
        'pastel-yellow': '#FFFFCC',
        'pastel-indigo': '#99CCFF',
        'pastel-blue': '#DAF0F7',
        'pastel-green': '#B2DFDB',
        'pastel-emerald': '#CCFFCC',
        'pastel-purple': '#CCCCFF'
      }
    },
    fontFamily: {
      miltonian: '"Miltonian", serif'
    }
  },
  plugins: []
} satisfies Config;
