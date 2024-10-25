import { tool } from "ai";
import { and, cosineDistance, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { safeAwait } from "~~/layers/josh/utils/safeTry";
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

		const [_err, matchUsers] = await safeAwait(
			db
				.selectDistinctOn([userEmbeddings.user_id], {
					embedding_similarity: userSimilarity,
					embedding_content: userEmbeddings.content,
					user_id: userEmbeddings.user_id,
					user_name: users.name,
					user_avatar: users.avatar_url,
					user_location: users.location,
					user_bio: users.bio,
					user_username: users.username,
					user_skills: users.skills,
					user_tech_stack: users.tech_stack,
					user_interests: users.interests,
					user_availability: users.availability,
					user_experience: users.experience_level,
					user_match_user: users.match_user,
					user_match_project: users.match_project,
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
				.limit(10),
		);
		console.log(matchUsers);

		return { component: "DeveloperList" as const, developers: matchUsers };
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

		return { component: "ProjectList" as const, props: params };
	},
});

export type SearchDevelopersReturnType = ReturnType<typeof searchDevelopers.execute>;
export type SearchProjectsReturnType = ReturnType<typeof searchProjects.execute>;
