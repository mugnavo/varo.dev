import { and, eq, or } from "drizzle-orm";
import { projectMatches, userMatches } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const { user } = await getUserSession(event);

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const userConnections = await db.query.userMatches.findMany({
		where: and(
			or(eq(userMatches.user1_id, user.id), eq(userMatches.user2_id, user.id)),
			and(
				eq(userMatches.user1_status, "accepted"),
				eq(userMatches.user2_status, "accepted"),
			),
		),
	});

	const projectConnections = await db.query.projectMatches.findMany({
		where: and(
			eq(projectMatches.user_id, user.id),
			and(
				eq(projectMatches.project_status, "accepted"),
				eq(projectMatches.user_status, "accepted"),
			),
		),
	});

	return { users: userConnections, projects: projectConnections };
});
