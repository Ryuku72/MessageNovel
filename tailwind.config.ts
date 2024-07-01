/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Config } from 'tailwindcss';
import { Escape, Unit } from '~/types';

const unitsPlugin =
  ({ units }: { units: Unit[] }) =>
  ({ addVariant, e }: { addVariant: any; e: Escape }) => {
    units.map(unit => {
      addVariant(unit, ({ container, modifySelectors }: any) => {
        modifySelectors(({ className }: { className: string }) => `.${e(`${unit}:${className}`)}`);

        container.walkRules((rule: any) => {
          rule.walkDecls((decl: any) => {
            if (decl.value.match(/^\d\.*\d*/g)) {
              decl.value = decl.value.replace(/\D+$/g, unit);
            }
          });
        });
      });
    });
  };

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      minWidth: {
        'card-l': '480px',
        'c-600': '600px',
        'c-800': '800px',
        button: '105px'
      },
      width: {
        'card-l': '480px',
        'c-600': '600px',
        'c-800': '800px',
        access: '40px',
        navicon: '60px',
        icon: '80px',
        button: '125px',
        'wide-button': '165px',
        wide: 'min(100%, 1850px)'
      },
      maxWidth: {
        'card-l': '480px',
        'c-600': '600px',
        'c-800': '800px',
        button: '125px',
        wide: 'min(100%, 1850px)'
      },
      height: {
        icon: '60px',
        button: '50px',
        access: '40px'
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
      },
      screens: {
        wide: '1740px'
      }
    },
    fontFamily: {
      miltonian: '"Miltonian", serif'
    }
  },
  plugins: [unitsPlugin({ units: ['em', 'vw', 'vh', '%'] })],
  variants: {
    extend: {
      width: ['em', 'vh', 'vw', '%'],
      height: ['em', 'vh', 'vw', '%']
    }
  }
} satisfies Config;
