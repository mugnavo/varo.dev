export default defineNuxtConfig({
	compatibilityDate: "2024-10-07",

	future: {
		compatibilityVersion: 4,
	},

	modules: ["nuxt-auth-utils"],

	runtimeConfig: {
		// Define here on what endpoints this layer will fetch when github oauth event happens
		// TODO: Add more OAuth
		callbacks: {
			github: {
				success: "/api/auth/github-success",
				failure: "/api/auth/github-failure",
			},
		},

		oauth: {
			github: {
				clientId: process.env.NUXT_GITHUB_CLIENT_ID,
				clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
				redirectURL:
					process.env.NUXT_BASE_URL! + process.env.NUXT_GITHUB_REDIRECT_PATH,
			},
		},
	},
});
