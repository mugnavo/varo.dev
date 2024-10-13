import { and, eq } from "drizzle-orm";
import { GithubSuccessEventHandler } from "~~/layers/auth/server/utils/callbacks";
import { oauthAccounts, users } from "~~/server/schemas";

export default GithubSuccessEventHandler(async (event, { tokens, user }) => {
	const existingUser = await db.query.oauthAccounts.findFirst({
		where: and(
			eq(oauthAccounts.provider_id, "github"),
			eq(oauthAccounts.provider_user_id, user.id),
		),
	});

	// login existing user
	if (existingUser) {
		// TODO: update user info if outdated?
		await setUserSession(event, {
			user: {
				id: existingUser.user_id,
				username: user.login,
				name: user.name,
				email: user.email,
				avatar_url: user.avatar_url,
			},
		});
		return sendRedirect(event, "/dashboard");
	}

	// register new user
	const newUserId = await db.transaction(async (tx) => {
		const [newUser] = await tx
			.insert(users)
			.values({
				email: user.email,
				username: user.login,
				name: user.name || user.login,
				avatar_url: user.avatar_url,
			})
			.returning();
		await tx.insert(oauthAccounts).values({
			provider_id: "github",
			provider_user_id: user.id,
			user_id: newUser.id,
		});

		return newUser.id;
	});

	await setUserSession(event, {
		user: {
			id: newUserId,
			username: user.login,
			name: user.name,
			email: user.email,
			avatar_url: user.avatar_url,
		},
	});
	return sendRedirect(event, "/dashboard");
});
