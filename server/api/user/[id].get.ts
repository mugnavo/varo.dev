import { eq } from "drizzle-orm";
import { users } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		throw createError({ statusCode: 400, message: "Invalid user ID" });
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, id),
	});

	if (!user) {
		throw createError({ statusCode: 404, message: "User not found" });
	}

	return { user };
});
