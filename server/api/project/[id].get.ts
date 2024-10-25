import { eq } from "drizzle-orm";
import { projects } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		throw createError({ statusCode: 400, message: "Invalid project ID" });
	}

	const projectResult = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	return projectResult;
});
