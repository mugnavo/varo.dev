import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { GitHub } from "arctic";

import { type User as DatabaseUser, session as sessionTable, user as userTable } from "../schemas";
import { db } from "./db";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attr) => ({
    id: attr.id,
    name: attr.name,
    firstName: attr.firstName,
    lastName: attr.lastName,
    avatarUrl: attr.avatarUrl,
    email: attr.email,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUser;
  }
}

// OAuth2 Providers
export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID as string,
  process.env.GITHUB_CLIENT_SECRET as string,
  process.env.GITHUB_REDIRECT_URI || null
);
// export const google = new Google(
//   process.env.GOOGLE_CLIENT_ID as string,
//   process.env.GOOGLE_CLIENT_SECRET as string,
//   process.env.GOOGLE_REDIRECT_URI as string
// );
