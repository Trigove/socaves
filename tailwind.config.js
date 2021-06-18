const colors = require('tailwindcss/colors');
//See here: https://tailwindcss.nuxtjs.org/tailwind-config/

module.exports = {
  mode: 'jit',
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  important: true,
  // prefix: 'tw-',
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#fff',
      teal: colors.teal,
      orange: colors.orange,
      gray: colors.trueGray,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      black: colors.black,
      bg: '#F7F7FA', //Background color
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        base: '0 5px 20px 0 rgba(0, 0, 0, 0.05)', //Card shadow
      },
      fontSize: {
        xxs: '0.6rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    //tailwindcss-aspect-ratio https://github.com/tailwindlabs/tailwindcss-aspect-ratio
    require('@tailwindcss/aspect-ratio'),
    //tailwind-css-variables https://github.com/omarkhatibco/tailwind-css-variables
    require('tailwind-css-variables')(
      {
        //Disable others as we only need to leak the colors to css vars
        colors: 'color',
        screens: false,
        fontFamily: false,
        fontSize: false,
        fontWeight: false,
        lineHeight: false,
        letterSpacing: false,
        backgroundSize: false,
        borderWidth: false,
        borderRadius: false,
        width: false,
        height: false,
        minWidth: false,
        minHeight: false,
        maxWidth: false,
        maxHeight: false,
        padding: false,
        margin: false,
        boxShadow: false,
        zIndex: false,
        opacity: false,
      },
      {
        // options
      }
    ),
  ],
};
