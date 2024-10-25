import { tool } from "ai";
import { z } from "zod";

export const searchDevelopers = tool({
	description: `Search for developers in the platform based on the user's prompt.`,
	parameters: z.object({}),

	execute: async (params) => {
		console.log("calling");
		console.log(params);

		return { component: "ProfileForm", props: params };
	},
});

export const searchProjects = tool({
	description: `Search for projects in the platform based on the user's prompt.`,
	parameters: z.object({}),

	execute: async (params) => {
		console.log("calling");
		console.log(params);

		return { component: "ProfileForm", props: params };
	},
});
