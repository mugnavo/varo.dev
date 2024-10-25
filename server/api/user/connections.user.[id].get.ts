import { and, eq } from "drizzle-orm";
import { projectMatches } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		return new Response("Invalid project ID", { status: 400 });
	}

	const { user } = await getUserSession(event);

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
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

	return Response.json({ connected: !!projectConnected }, { status: 200 });
});
