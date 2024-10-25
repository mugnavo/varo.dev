import { and, eq, ne, or } from "drizzle-orm";
import { projectMatches, userMatches } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const { user } = await getUserSession(event);

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const userSuggestions = await db.query.userMatches.findMany({
		where: and(
			or(eq(userMatches.user1_id, user.id), eq(userMatches.user2_id, user.id)),
			and(
				ne(userMatches.user1_status, "accepted"),
				ne(userMatches.user2_status, "accepted"),
				ne(userMatches.user1_status, "rejected"),
				ne(userMatches.user2_status, "rejected"),
			),
		),
		with: {
			user1: {
				columns: { embedding: false },
			},
			user2: {
				columns: { embedding: false },
			},
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
			project: {
				columns: { embedding: false },
			},
		},
	});

	return Response.json(
		{ users: userSuggestions, projects: projectSuggestions },
		{ status: 200 },
	);
});
