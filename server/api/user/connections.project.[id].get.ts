import { and, eq, or } from "drizzle-orm";
import { userMatches } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		return new Response("Invalid user ID", { status: 400 });
	}

	const { user } = await getUserSession(event);

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const userConnected = await db.query.userMatches.findFirst({
		where: and(
			or(
				and(eq(userMatches.user1_id, user.id), eq(userMatches.user2_id, id)),
				and(eq(userMatches.user1_id, id), eq(userMatches.user2_id, user.id)),
			),
			and(
				eq(userMatches.user1_status, "accepted"),
				eq(userMatches.user2_status, "accepted"),
			),
		),
	});

	return Response.json({ connected: !!userConnected }, { status: 200 });
});
