import { eq } from "drizzle-orm";
import { projects } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		throw createError({ statusCode: 400, message: "Invalid user ID" });
	}

	const projectsResult = await db.query.projects.findMany({
		where: eq(projects.owner_id, id),
	});

	return { projects: projectsResult };
});
