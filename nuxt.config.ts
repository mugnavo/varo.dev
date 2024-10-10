// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-10-07",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@vueuse/nuxt",
    "@nuxthub/core",
    "@nuxtjs/tailwindcss",
    "nuxt-auth-utils",
    "nuxt-typed-router",
    "nuxt-build-cache",
    "@vant/nuxt",
  ],

  runtimeConfig: {
    databaseUrl: process.env.NUXT_DATABASE_URL,

    sessionPassword: process.env.NUXT_SESSION_PASSWORD,
    baseUrl: process.env.NUXT_BASE_URL,

    oauth: {
      github: {
        clientId: process.env.NUXT_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
        redirectURL: process.env.NUXT_BASE_URL! + process.env.NUXT_GITHUB_REDIRECT_PATH,
      },
    },
  },
});
