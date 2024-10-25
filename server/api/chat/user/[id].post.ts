import { z } from "zod";
import { userMessages } from "~~/server/schemas";

const messageSchema = z.object({
	message: z.string(),
});

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);

	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		throw createError({ statusCode: 400, message: "Invalid user ID" });
	}

	const body = await readValidatedBody(event, (b) => messageSchema.parse(b));

	// TODO validate first if they are connected

	const [newMessage] = await db
		.insert(userMessages)
		.values({
			sender_id: user.id,
			recipient_id: id,
			message: body.message,
		})
		.returning();

	return newMessage;
});
