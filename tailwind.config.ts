import type { Config } from "tailwindcss";

export default <Partial<Config>>{
	theme: {
		extend: {
			animation: {
				"fade-in": "fadeIn 1.25s ease-in-out",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
			fontFamily: {
				custom: ["DMSans"],
			},
		},
	},
	plugins: [require("tailwindcss-primeui")],
	content: [
		"app/**/*.{vue,js,ts}",
		"layers/**/*.{vue,js,ts}",
		"components/**/*.{vue,js,ts}",
		"layouts/**/*.vue",
		"pages/**/*.vue",
		"composables/**/*.{js,ts}",
		"plugins/**/*.{js,ts}",
		"App.{js,ts,vue}",
		"app.{js,ts,vue}",
		"Error.{js,ts,vue}",
		"error.{js,ts,vue}",
		"content/**/*.md",
	],
};
