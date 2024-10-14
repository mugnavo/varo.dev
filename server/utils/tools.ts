import { tool } from "ai";
import { z } from "zod";

export const updateProfile = tool({
	description: `Update the user's profile based on provided information`,
	parameters: z.object({
		match_user: z
			.boolean()
			.default(true)
			.describe(
				"Whether the user wants to match with other users. True by default.",
			),
		match_project: z
			.boolean()
			.default(true)
			.describe("Whether the user wants to match with projects. True by default."),

		bio: z.string().describe("User's bio or description"),
		location: z.string().describe("User's location"),
		experience_level: z
			.number()
			.min(1)
			.max(5)
			.describe("User's experience level, ranging from 1 (beginner) to 5 (expert)"),
		availability: z
			.number()
			.min(1)
			.max(5)
			.describe(
				"User's availability, ranging from 1 (least available/busy fulltime) to 5 (most available/not busy)",
			),

		skills: z.string().array().describe("Array of user's skills"),
		tech_stack: z
			.string()
			.array()
			.describe("Array of specific technologies the user is proficient in"),
		interests: z.string().array().describe("Array of user's interests"),
	}),

	execute: async (params) => {
		console.log("calling");
		console.log(params);

		// TODO: generate embeddings and save updated profile to database

		return "Profile updated successfully.";
	},
});
