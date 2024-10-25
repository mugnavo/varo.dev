import { and, eq, ne, or } from "drizzle-orm";
import { projectMatches, userMatches } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const { user } = await getUserSession(event);

	if (!user) {
		throw createError({ statusCode: 401, message: "Unauthorized" });
	}

	const userSuggestions = await db.query.userMatches.findMany({
		where: and(
			or(eq(userMatches.user1_id, user.id), eq(userMatches.user2_id, user.id)),
			or(
				eq(userMatches.user1_status, "pending"),
				eq(userMatches.user2_status, "pending"),
			),
			or(
				ne(userMatches.user1_status, "rejected"),
				ne(userMatches.user2_status, "rejected"),
			),
		),
		with: {
			user1: true,
			user2: true,
		},
	});

	const projectSuggestions = await db.query.projectMatches.findMany({
		where: and(
			eq(projectMatches.user_id, user.id),
			and(
				ne(projectMatches.project_status, "accepted"),
				ne(projectMatches.user_status, "accepted"),
				ne(projectMatches.user_status, "rejected"),
				ne(projectMatches.project_status, "rejected"),
			),
		),
		with: {
			project: true,
		},
	});

	console.log(userSuggestions);

	return { users: userSuggestions, projects: projectSuggestions };
});
