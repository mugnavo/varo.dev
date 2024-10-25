import { eq } from "drizzle-orm";
import { projects } from "~~/server/schemas";

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, "id"));

	if (!id || !Number.isInteger(id)) {
		return new Response("Invalid user ID", { status: 400 });
	}

	const projectsResult = await db.query.projects.findMany({
		where: eq(projects.owner_id, id),
		columns: { embedding: false },
	});

	return Response.json({ projects: projectsResult }, { status: 200 });
});
