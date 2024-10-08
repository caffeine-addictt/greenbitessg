import type { Config } from 'tailwindcss';
import { withUt } from 'uploadthing/tw';

const config = withUt({
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        transparent: 'transparent',
        background: {
          light: '#F1FEF4',
          dark: '#2A2928',
        },
        surface: {
          light: '#F8F8F8',
          dark: '#202020',
        },
        primary: {
          light: '#3CC360',
          dark: {
            DEFAULT: '#CDBCB1',
            200: '#B5A69C',
          },
        },
        text: {
          light: '#010E04',
          dark: '#EBE5E0',
        },
        secondary: {
          light: '#7EAAF7',
          dark: '#5ACA41',
        },
        accent: {
          light: '#5552F4',
          dark: '#73A586',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config);

export default config;
