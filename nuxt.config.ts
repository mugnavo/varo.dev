// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-10-07",
	devtools: { enabled: false },

	future: {
		compatibilityVersion: 4,
	},

	modules: [
		"@pinia/nuxt",
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@vueuse/nuxt",
		"@nuxtjs/tailwindcss",
		"nuxt-auth-utils",
		"nuxt-typed-router",
		"nuxt-build-cache",
		"@vant/nuxt",
		"@primevue/nuxt-module",
	],

	runtimeConfig: {
		sessionPassword: process.env.NUXT_SESSION_PASSWORD,
		baseUrl: process.env.NUXT_BASE_URL,

		googleGenerativeAiApiKey: process.env.NUXT_GOOGLE_GENERATIVE_AI_API_KEY,

		oauth: {
			github: {
				clientId: process.env.NUXT_GITHUB_CLIENT_ID,
				clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
				redirectURL:
					process.env.NUXT_BASE_URL! + process.env.NUXT_GITHUB_REDIRECT_PATH,
			},
		},
	},

	app: {
		head: {
			bodyAttrs: {
				class: "dark",
			},
			title: "Varo",
		},
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern-compiler", // or "modern"
				},
			},
		},
	},

	vant: {
		defaultLocale: "en-US",
	},
});
