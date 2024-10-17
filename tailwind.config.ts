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
		},
	},
};
