import { tool } from "ai";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { userEmbeddings, users } from "../schemas";
import { generateEmbedding } from "./embedding";

export const searchDevelopers = tool({
	description: `Search for developers in the platform based on the user's prompt.`,
	parameters: z.object({
		query: z.string().describe("The user's search query."),
	}),

	execute: async (params) => {
		console.log("calling searchDevelopers");
		console.log(params);
		const embeddedQuery = await generateEmbedding(params.query);

		const userSimilarity = sql<number>`1 - (${cosineDistance(
			userEmbeddings.embedding,
			embeddedQuery,
		)})`;

		console.log(userSimilarity);

		let matchUsers = [] as unknown;
		try {
			matchUsers = await db
				.select({
					embedding_similarity: userSimilarity,
					embedding_content: userEmbeddings.content,
					user_id: userEmbeddings.user_id,
					user_name: users.name,
					// todo add more fields from user
				})
				.from(userEmbeddings)
				.innerJoin(users, eq(userEmbeddings.user_id, users.id))
				.where(
					and(
						gt(userSimilarity, 0.6),
						// ne(userEmbeddings.user_id, user.id),
						eq(users.match_user, true),
					),
				)
				.orderBy((t) => desc(t.embedding_similarity))
				.limit(10);
			console.log(matchUsers);
		} catch (e) {
			console.log(e);
		}

		return { component: "DeveloperList", developers: matchUsers };
	},
});

export const searchProjects = tool({
	description: `Search for projects in the platform based on the user's prompt.`,
	parameters: z.object({
		query: z.string().describe("The user's search query."),
	}),

	execute: async (params) => {
		console.log("calling searchProjects");
		console.log(params);

		return { component: "ProjectList", props: params };
	},
});
