import webpack from 'webpack';
import redirectSSL from 'redirect-ssl';
import recaptcha from './config/recaptcha.js';

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    meta: [
      { charset: 'utf-8' },
      {
        hid: 'description',
        name: 'description',
        content:
          'The new age of social media, a fully open source social media platform, we aim to build a privacy-focused social media platform',
      },
      { hid: 'og:title', property: 'og:title', content: 'Socaves' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'The new age of social media, a fully open source social media platform, we aim to build a privacy-focused social media platform',
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://socaves.com/',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '~/assets/img/icon.png',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover',
      },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'Socaves' },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'The new age of social media, we focus on your privacy.',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        href: 'splashScreen/iphone5_splash.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        href: 'splashScreen/iphone6_splash.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        href: 'splashScreen/iphoneplus_splash.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
        href: 'splashScreen/iphonexr_splash.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        href: 'splashScreen/iphonexs_splash.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        href: 'splashScreen/ipad_splash.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        href: 'splashScreens/ipadpro1_splash.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        href: 'splashScreens/ipadpro3_splash.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        href: 'splashScreens/ipadpro2_splash.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        href: 'splashScreens/ipadpro2_splash.png',
      },
    ],
  },

  env: {
    baseURL: 'http://localhost:3000',
  },

  serverMiddleware: [
    redirectSSL.create({
      enabled: process.env.NODE_ENV === 'production',
    }),
    {
      // API middleware
      path: '/server-api',
      handler: '~/server',
    },
  ],

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    'vuesax/dist/vuesax.css',
    '@/assets/css/tailwind.css',
    '@/assets/scss/base/_typography.scss', //Fonts
    '@/assets/scss/main.scss',
    '@/assets/scss/utilities/_helpers.scss',
    '@/assets/scss/base/_reset.scss',
    '@/assets/scss/tiptap.scss',
    '@/assets/scss/advanced-cropper.scss',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/plugins/vuesax' },
    //iconify - Icon plugin (https://docs.iconify.design/implementations/vue/)
    { src: '@/plugins/iconify' },
    //Vee validate - for form validation (https://vee-validate.logaretm.com/v3/guide/basics.html#registering-the-validation-provider)
    { src: '@/plugins/veeValidate' },
    //Our own project global variables
    { src: '@/plugins/globalVars' },
    //Our own project global components
    { src: '@/plugins/globalComponents' },
    //Our own project global mixins
    { src: '@/plugins/globalMixins' },
    //Tippy https://atomiks.github.io/tippyjs/v6/all-props/
    { src: '@/plugins/tippy' },
    //Video.js https://docs.videojs.com/tutorial-vue.html
    { src: '@/plugins/videoJs' },
    //Prevent XSS https://www.npmjs.com/package/xss
    { src: '@/plugins/xss' },
    //Vue awesome swiper: https://github.com/surmon-china/vue-awesome-swiper
    { src: '@/plugins/swiper', ssr: false },
    //https://github.com/redxtech/vue-plyr#ssr
    { src: '~/plugins/plyr', ssr: false },
    { src: '~/plugins/fancybox', ssr: false },
    //wave-surfer
    { src: '~/plugins/wave-surfer', ssr: false },
    // { src: '~/plugins/socket.client.js', ssr: false },
    //Scroll into view https://github.com/KoryNunn/scroll-into-view#readme
    { src: '~/plugins/scrollIntoView', ssr: false },
    //https://github.com/gregjacobs/Autolinker.js/
    { src: '~/plugins/autolinker' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    //https://tailwindcss.com/docs/guides/nuxtjs
    '@nuxtjs/tailwindcss',
    //Style Resources for global style https://github.com/nuxt-community/style-resources-module#readme
    '@nuxtjs/style-resources',
    //Image optimize https://github.com/juliomrqz/nuxt-optimized-images
    '@aceforth/nuxt-optimized-images',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://github.com/nuxt-community/robots-module
    '@nuxtjs/robots',
    //https://i18n.nuxtjs.org/setup
    'nuxt-i18n',
    //Media query plugin https://github.com/reegodev/vue-screen#nuxt-module
    'vue-screen/nuxt',
    //https://gitlab.com/broj42/nuxt-lazy-load#readme
    [
      'nuxt-lazy-load',
      {
        polyfill: false,
        directiveOnly: true,
        loadingClass: 'skeleton-loading',
        appendClass: false,
      },
    ],
    //SEO sitemap https://sitemap.nuxtjs.org/guide/setup
    '@nuxtjs/sitemap',
    //https://www.npmjs.com/package/@nuxtjs/recaptcha
    '@nuxtjs/recaptcha',
  ],

  sitemap: {
    hostname: 'https://socaves.com',
    exclude: [
      '/chat',
      '/profile/**',
      '/recovery/**',
      '/404',
      '/blank',
      '/callback',
      '/video',
      '/voiceMessage',
      '/verify',
      '/settings',
      '/friend',
    ],
  },

  // tailwindcss: {
  //   jit: true,
  // },

  // Robots.txt module configuration (https://github.com/nuxt-community/robots-module)
  robots:
    process.env.NODE_ENV === 'development'
      ? {
          //Disable index as we are in development stage
          UserAgent: '*',
          Disallow: '/',
        }
      : {},

  //Loading bar https://nuxtjs.org/docs/2.x/features/loading
  // loading: {
  //   color: '#F93716',
  // },

  //https://github.com/nuxt-community/style-resources-module#readme './assets/vars/*.scss'
  styleResources: {
    // your settings here
    scss: [
      '@/assets/scss/utilities/_variables.scss',
      '@/assets/scss/utilities/_mixins.scss',
      '@/assets/scss/utilities/_functions.scss',
    ],
  },

  pwa: {
    meta: {
      title: 'Socaves',
      author: 'Socaves',
      appleStatusBarStyle: 'default-translucent',
      nativeUI: 'true',
    },
    manifest: {
      name: 'Socaves',
      short_name: 'Socaves',
      lang: 'en',
      orientation: 'portrait',
      theme_color: '#ffffff',
    },
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: `${
      process.env.NODE_ENV === 'production'
        ? 'https://socaves.com/'
        : process.env.ON_SITE
        ? 'https://socaves-test.herokuapp.com/'
        : 'http://localhost:3000/'
    }api/`,
    timeout: 5000,
    withCredentials: true,
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
    ],

    terser: {
      // https://github.com/terser/terser#compress-options
      terserOptions: {
        compress: {
          //Disable console log in prod build
          drop_console: true,
        },
      },
    },

    //Enable thread-loader in webpack building ⚠️ Experimental
    parallel: true,

    transpile: [
      //See here:https://logaretm.github.io/vee-validate/guide/rules.html#installing-all-rules
      'vee-validate/dist/rules',
      //See here: https://www.npmjs.com/package/@iconify-icons/bx
      '@iconify-icons',
    ],
    /*
     ** You can extend webpack config here
     */
    extend(_config, ctx) {
      //Delete all data-test attr if in production
      ctx.loaders.vue.compilerOptions = {
        modules: [
          {
            preTransformNode(astEl) {
              if (process.env.NODE_ENV === 'production') {
                //console.log('Remove all data-test attribute');
                const { attrsMap, attrsList } = astEl;
                if (attrsMap['data-test']) {
                  delete attrsMap['data-test'];
                  const index = attrsList.findIndex(
                    (x) => x.name === 'data-test'
                  );
                  attrsList.splice(index, 1);
                }
              }
              return astEl;
            },
          },
        ],
      };
    },
  },

  //Multi lang config  https://i18n.nuxtjs.org/basic-usage
  //More: https://phrase.com/blog/posts/nuxt-js-tutorial-i18n/
  i18n: {
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.js',
        name: 'English',
      },
      {
        code: 'zh',
        iso: 'zh-HK',
        file: 'zh.js',
        name: '繁體中文',
      },
    ],
    lazy: true,
    seo: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      onlyOnRoot: true,
      alwaysRedirect: true,
    },
    langDir: 'lang/',
    defaultLocale: 'en',
  },

  // watchers: {
  //   webpack: {
  //     poll: true,
  //   },
  // },

  //Query of optimize https://github.com/juliomrqz/nuxt-optimized-images/blob/develop/docs/usage.md#query-params
  //https://github.com/juliomrqz/nuxt-optimized-images
  optimizedImages: {
    optimizeImages: true,
  },

  recaptcha: {
    hideBadge: false, // Hide badge element (v3 & v2 via size=invisible)
    // language: String, // Recaptcha language (v2)
    siteKey: recaptcha.SITE_KEY, // Site key for requests
    version: 3, // Version
    size: 'compact', // Size: 'compact', 'normal', 'invisible' (v2)
  },

  auth: {
    watchLoggedIn: true,
    rewriteRedirects: true,
    resetOnError: true,
    redirect: {
      login: '/login',
      home: '/',
      logout: '/',
      callback: '/callback',
    },
    strategies: {
      cookie: {
        token: {
          required: false,
          type: false,
        },
        user: {
          property: false,
          autoFetch: false,
        },
        endpoints: {
          login: {
            url: '/login',
            method: 'PUT',
          },
          user: {
            url: '/user',
            method: 'GET',
          },
          logout: {
            url: '/logout',
            method: 'GET',
          },
        },
      },
      local: false,
    },
  },
};
