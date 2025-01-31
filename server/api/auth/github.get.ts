import { and, eq } from "drizzle-orm";
import { oauthAccounts, userEmbeddings, users } from "~~/server/schemas";

export default defineOAuthGitHubEventHandler({
	config: {
		emailRequired: true,
	},
	async onSuccess(event, { user }) {
		const existingUser = await db.query.oauthAccounts.findFirst({
			where: and(
				eq(oauthAccounts.provider_id, "github"),
				eq(oauthAccounts.provider_user_id, user.id),
			),
			with: {
				user: true,
			},
		});

		// login existing user
		if (existingUser) {
			const existingEmbeddings = await db.query.userEmbeddings.findFirst({
				where: eq(userEmbeddings.user_id, existingUser.user_id),
			});
			// TODO: update user info if outdated?
			await setUserSession(event, {
				user: {
					id: existingUser.user_id,
					username: user.login,
					name: user.name,
					email: user.email,
					avatar_url: user.avatar_url,
					finished_setup: !!existingEmbeddings,
				},
			});
			return sendRedirect(event, "/app");
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
				finished_setup: false,
			},
		});
		return sendRedirect(event, "/app");
	},
	// Optional, will return a json error and 401 status code by default
	onError(event, error) {
		console.error("GitHub OAuth error:", error);
		return sendRedirect(event, "/");
	},
});
