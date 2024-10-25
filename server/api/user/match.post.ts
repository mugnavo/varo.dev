import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import { userMatches } from "~~/server/schemas";

const matchSchema = z.object({
	user_id: z.number(),
	status: z.enum(["pending", "accepted", "rejected"]).optional().default("accepted"),
});

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);

	const body = await readValidatedBody(event, (b) => matchSchema.parse(b));

	// TODO validate first if they are connected

	// first, get the match
	const match = await db.query.userMatches.findFirst({
		where: or(
			and(
				eq(userMatches.user1_id, user.id),
				eq(userMatches.user2_id, body.user_id),
			),
			and(
				eq(userMatches.user2_id, user.id),
				eq(userMatches.user1_id, body.user_id),
			),
		),
	});

	let returnedMatch;
	if (match) {
		returnedMatch = await db
			.update(userMatches)
			.set({
				user1_status:
					match.user1_id === user.id ? body.status : match.user1_status,
				user2_status:
					match.user2_id === user.id ? body.status : match.user2_status,
			})
			.where(
				and(
					eq(userMatches.user1_id, match.user1_id),
					eq(userMatches.user2_id, match.user2_id),
				),
			);
	} else {
		returnedMatch = await db.insert(userMatches).values({
			user1_id: user.id,
			user2_id: body.user_id,
			user1_status: user.id === body.user_id ? body.status : "pending",
			user2_status: user.id === body.user_id ? "pending" : body.status,
		});
	}

	return returnedMatch;
});
