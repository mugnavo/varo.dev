import { eq } from "drizzle-orm";
import { users } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		return new Response("Invalid user ID", { status: 400 });
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, id),
	});

	if (!user) {
		return new Response("User not found", { status: 404 });
	}

	return { user };
});
