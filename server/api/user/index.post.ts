import { and, cosineDistance, desc, eq, gt, ne, or, sql } from "drizzle-orm";
import { z } from "zod";
import {
	projectEmbeddings,
	projectMatches,
	projects,
	userEmbeddings,
	userMatches,
	users,
} from "~~/server/schemas";
import { generateEmbeddings } from "~~/server/utils/embedding";

const userProfileSchema = z.object({
	match_user: z
		.boolean()
		.optional()
		.default(true)
		.describe("Whether the user wants to match with other users. True by default."),
	match_project: z
		.boolean()
		.optional()
		.default(true)
		.describe("Whether the user wants to match with projects. True by default."),

	bio: z.string().optional().describe("User's bio or description"),
	location: z.string().optional().describe("User's location"),
	experience_level: z
		.number()
		.min(1)
		.max(5)
		.describe("User's experience level, ranging from 1 (beginner) to 5 (expert)"),
	availability: z
		.number()
		.min(1)
		.max(5)
		.describe(
			"User's availability, ranging from 1 (least available/busy fulltime) to 5 (most available/not busy)",
		),

	skills: z.string().array().optional().describe("Array of user's skills"),
	tech_stack: z
		.string()
		.array()
		.optional()
		.describe("Array of specific technologies the user is proficient in"),
	interests: z.string().array().optional().describe("Array of user's interests"),
});

export default defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, (b) => userProfileSchema.parse(b));

	const { user } = await getUserSession(event);

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	await db.update(users).set(body).where(eq(users.id, user.id));

	const chunks = [
		...(body.skills || []),
		...(body.tech_stack || []),
		...(body.interests || []),
		// last chunk should be a combination of 3 fields above in one string
		`${body.skills?.join(" ") || ""} ${body.tech_stack?.join(" ") || ""} ${
			body.interests?.join(" ") || ""
		}`,
	];

	console.log("Chunk length: ", chunks.length);
	console.log("Last chunk: ", chunks[chunks.length - 1]);

	if (chunks.length) {
		const embeddings = await generateEmbeddings(chunks);
		console.log("Embeddings length: ", embeddings.length);
		console.log(
			"Last embedding content: ",
			embeddings[embeddings.length - 1].content,
		);
		await db.transaction(async (tx) => {
			console.log("Deleting existing embeddings and pending matches...");
			// delete existing embeddings
			await tx.delete(userEmbeddings).where(eq(userEmbeddings.user_id, user.id));

			// delete any pending matches
			await tx
				.delete(userMatches)
				.where(
					and(
						or(
							eq(userMatches.user1_id, user.id),
							eq(userMatches.user2_id, user.id),
						),
						and(
							ne(userMatches.user1_status, "accepted"),
							ne(userMatches.user2_status, "accepted"),
						),
					),
				);
			await tx
				.delete(projectMatches)
				.where(
					and(
						eq(projectMatches.user_id, user.id),
						ne(projectMatches.project_status, "accepted"),
						ne(projectMatches.user_status, "accepted"),
					),
				);

			console.log("Inserting new embeddings...");
			// insert new embeddings excluding the last one
			await tx
				.insert(userEmbeddings)
				.values(embeddings.slice(0, -1).map((e) => ({ user_id: user.id, ...e })));

			// look for new matches using the last embedding
			if (body.match_user) {
				console.log("Looking for new user matches...");
				const userSimilarity = sql<number>`1 - (${cosineDistance(
					userEmbeddings.embedding,
					embeddings[embeddings.length - 1].embedding,
				)})`;

				const matchUsers = await tx
					.select({
						name: userEmbeddings.content,
						userSimilarity,
						user_id: userEmbeddings.user_id,
					})
					.from(userEmbeddings)
					.innerJoin(users, eq(userEmbeddings.user_id, users.id))
					.where(
						and(
							gt(userSimilarity, 0.5),
							ne(userEmbeddings.user_id, user.id),
							eq(users.match_user, true),
						),
					)
					.orderBy((t) => desc(t.userSimilarity))
					.limit(10);

				if (matchUsers.length) {
					console.log(`Inserting ${matchUsers.length} new user matches...`);
					// insert new matches
					await tx.insert(userMatches).values(
						matchUsers.map((m) => ({
							user1_id: user.id,
							user2_id: m.user_id,
							user1_status: "pending" as const,
							user2_status: "pending" as const,
						})),
					);
				} else {
					console.log("No user matches found.");
				}
			}

			if (body.match_project) {
				console.log("Looking for new project matches...");
				const projectSimilarity = sql<number>`1 - (${cosineDistance(
					projectEmbeddings.embedding,
					embeddings[embeddings.length - 1].embedding,
				)})`;

				const matchProjects = await tx
					.select({
						name: projectEmbeddings.content,
						projectSimilarity,
						project_id: projectEmbeddings.project_id,
					})
					.from(projectEmbeddings)
					.innerJoin(projects, eq(projectEmbeddings.project_id, projects.id))
					.where(
						and(gt(projectSimilarity, 0.5), eq(projects.match_enabled, true)),
					)
					.orderBy((t) => desc(t.projectSimilarity))
					.limit(10);

				if (matchProjects.length) {
					console.log(
						`Inserting ${matchProjects.length} new project matches...`,
					);
					// insert new matches
					await tx.insert(projectMatches).values(
						matchProjects.map((m) => ({
							user_id: user.id,
							project_id: m.project_id,
							user_status: "pending" as const,
							project_status: "pending" as const,
						})),
					);
				} else {
					console.log("No project matches found.");
				}
			}
		});
	}

	await setUserSession(event, {
		user: {
			...user,
			finished_setup: true,
		},
	});

	return Response.json({ msg: "Profile updated successfully." }, { status: 200 });
});
