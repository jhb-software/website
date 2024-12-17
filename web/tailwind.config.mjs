const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#1e3a8a',
        primaryDark: '#162D6E',
        'neutral-150': '#EDEDED',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
