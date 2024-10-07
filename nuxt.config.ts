import { resolve } from "node:path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-10-06",
  // devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: ["@nuxt/eslint", "@nuxtjs/tailwindcss", "@nuxthub/core"],
  modules: [
    "@nuxt/eslint",
    "@nuxthub/core",
    "@nuxtjs/tailwindcss",
    "@hebilicious/authjs-nuxt",
  ],
  authJs: {
    guestRedirectTo: "/", // please lang ko change ani master
    authenticatedRedirectTo: "/dashboard", // kani sad
    baseUrl: process.env.NUXT_BASE_URL,
  },

  runtimeConfig: {
    databaseUrl: process.env.NUXT_DATABASE_URL,

    githubClientId: process.env.NUXT_GITHUB_CLIENT_ID,
    githubClientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
    githubRedirectUri: process.env.NUXT_GITHUB_REDIRECT_URI,

    googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.NUXT_GOOGLE_REDIRECT_URI,

    secret: process.env.NUXT_SECRET,
    baseUrl: process.env.NUXT_BASE_URL, // The URL of your deployed app (used for origin Check in production)
  },

  // Resolve authJS import errors on cookies
  alias: {
    cookie: resolve(__dirname, "node_modules/cookie"),
  },
});