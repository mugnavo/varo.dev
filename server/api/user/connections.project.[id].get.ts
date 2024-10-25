import { and, eq } from "drizzle-orm";
import { projectMatches } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		throw createError({ statusCode: 400, message: "Invalid project ID" });
	}

	const { user } = await getUserSession(event);

	if (!user) {
		throw createError({ statusCode: 401, message: "Unauthorized" });
	}

	const projectConnected = await db.query.projectMatches.findFirst({
		where: and(
			and(eq(projectMatches.user_id, user.id), eq(projectMatches.project_id, id)),
			and(
				eq(projectMatches.project_status, "accepted"),
				eq(projectMatches.user_status, "accepted"),
			),
		),
	});

	return { connected: !!projectConnected };
});
