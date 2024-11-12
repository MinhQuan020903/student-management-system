import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#e4e4e7',
        input: '#e4e4e7',
        ring: '#18181b',
        background: '#ffffff',
        foreground: '#0a0a0a',
        orange: '#FF7426',
        'yellow-orange': '#FFAE42',
        'silver-chalice': '#ACACAC',
        'old-lace': '#FDF8EE',
        parchment: '#F2E8D4',
        bossanova: '#4D2C5E',

        default: {
          DEFAULT: '#FDF8EE',
          foreground: '#09090b',
        },
        primary: {
          DEFAULT: '#FF7426',
          foreground: '#fafafa',
        },
        secondary: {
          DEFAULT: '#f4f4f5',
          foreground: '#FF7426',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa',
        },

        warning: {
          DEFAULT: '#FF7426',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#f4f4f5',
          foreground: '#18181b',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#09090b;',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#09090b',
        },
      },
      borderRadius: {
        xl: `12px`,
        lg: `8px`,
        md: `6px`,
        sm: '4px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0px' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0px' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    nextui(),
  ],
};
export default config;
