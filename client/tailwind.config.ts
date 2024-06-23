/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      background: {
        light: '#F1FEF4',
        dark: '#2A2928',
      },
      primary: {
        light: '#3CC360',
        dark: '#CDBCB1',
      },
      secondary: {
        light: '#7EAAF7',
        dark: '#5ACA41',
      },
      accent: {
        light: '#5552F4',
        dark: '#73A586',
      },
      text: {
        light: '#010E04',
        dark: '#EBE5E0',
      },
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
