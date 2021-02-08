const colors = require('vuetify/es5/util/colors').default;

module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      {
        name: 'ROBOTS',
        content: process.env.ROBORT || 'FOLLOW,INDEX',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/filters.js',
    '~/plugins/i18n.js',
    '~/plugins/exception-handler.js',
    '~/plugins/axios.js',
    '~/plugins/charts.js',
  ],
  /*
   ** Nuxt.js dev-modules include typescript
   */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build',
    //"@nuxtjs/eslint-module",
    'nuxt-typed-vuex',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#667EEA',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
   ** Build configuration
   */

  build: {
    /*
     ** You can extend webpack config here
     */
    transpile: [/typed-vuex/],
    extend(config) {
      config.devtool = false;
      /*config.module.rules.push({
        test: /\.(js)$/,
        use: ["thread-loader"],
        exclude: /(node_modules)/
      });
      config.module.rules.push({
        test: /\.ext$/,
        use: ["cache-loader", "thread-loader"],
        exclude: /(node_modules)/
      });*/
    },
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    },
  },
  watchers: {
    webpack: {
      poll: true,
    },
  },
  router: {
    middleware: 'i18n',
  },
  ignoreOptions: {
    ignorecase: false,
  },
};
