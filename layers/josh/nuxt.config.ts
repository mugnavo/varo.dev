// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-10-07",
	devtools: { enabled: false },

	future: {
		compatibilityVersion: 4,
	},

	modules: [
		"@pinia/nuxt",
		"@nuxt/fonts",
		"@vueuse/nuxt",
		"@nuxtjs/tailwindcss",
		"@primevue/nuxt-module",
	],

	tailwindcss: {
		configPath: "../../tailwind.config.ts",
		cssPath: ["../../assets/base.scss", { injectPosition: 0 }],
		exposeConfig: true,
		viewer: false,
	},

	css: ["../../assets/theme.scss", "primeicons/primeicons.css"],

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern-compiler", // or "modern"
				},
			},
		},
	},
});