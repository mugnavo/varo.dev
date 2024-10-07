import { OAuth2RequestError } from "arctic";
import { and, eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";

import { oauthAccount, user } from "~~/server/schemas";
import { github, lucia } from "~~/server/utils/auth";
import { db } from "~~/server/utils/db";

interface GitHubUser {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string;
  location: string | null;
  login: string;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;
  const storedState = getCookie(event, "github_oauth_state") ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
        "User-Agent": "lucia",
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    // Replace this with your own DB client.
    const existingUser = await db.query.oauthAccount.findFirst({
      where: and(
        eq(oauthAccount.providerId, "github"),
        eq(oauthAccount.providerUserId, githubUser.id),
      ),
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {});
      appendHeader(
        event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );
      return sendRedirect(event, "/");
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await db.transaction(async (tx) => {
      await tx.insert(user).values({
        id: userId,
        email: githubUser.email,
        name: githubUser.name || githubUser.login,
        avatarUrl: githubUser.avatar_url,
      });
      await tx
        .insert(oauthAccount)
        .values({ providerId: "github", providerUserId: githubUser.id, userId });
    });

    const session = await lucia.createSession(userId, {});
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    return sendRedirect(event, "/");
  } catch (e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      throw createError({
        status: 400,
      });
    }

    throw createError({
      status: 500,
    });
  }
});
