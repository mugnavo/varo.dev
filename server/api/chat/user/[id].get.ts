import { and, eq, or } from "drizzle-orm";
import { userMessages } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);

	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		throw createError({ statusCode: 400, message: "Invalid user ID" });
	}

	const query = getQuery(event);
	console.log(query);

	const messages = await db.query.userMessages.findMany({
		where: or(
			and(eq(userMessages.sender_id, user.id), eq(userMessages.recipient_id, id)),
			and(eq(userMessages.sender_id, id), eq(userMessages.recipient_id, user.id)),
		),
		offset: Number(query.offset) || undefined,
		orderBy: (userMessages, { desc }) => [desc(userMessages.created_at)],
	});

	return messages;
});
