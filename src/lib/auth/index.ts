import { serverOnly } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "~/lib/db";

const getAuthConfig = serverOnly(() =>
  betterAuth({
    baseURL: process.env.VITE_BASE_URL,
    database: drizzleAdapter(db, {
      provider: "pg",
    }),

    // https://www.better-auth.com/docs/concepts/session-management#session-caching
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },
    // caching this messes up with the "setup_at" field in user table,
    // which needs to take effect immediately after initial setup.
    // for now we're disabling the cache in __root's beforeLoad

    // https://www.better-auth.com/docs/concepts/oauth
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      },
    },

    // https://www.better-auth.com/docs/authentication/email-password
    // emailAndPassword: {
    //   enabled: true,
    // },

    plugins: [username(), reactStartCookies()],

    user: {
      additionalFields: {
        setup_at: {
          type: "date",
        },
        terms_accepted_at: {
          type: "date",
        },
        match_user: {
          type: "boolean",
          required: true,
          defaultValue: true,
        },
        match_project: {
          type: "boolean",
          required: true,
          defaultValue: true,
        },
        bio: {
          type: "string",
        },
        location: {
          type: "string",
        },
        experience_level: {
          type: "number",
        },
        availability: {
          type: "number",
        },
        idea_or_project: {
          type: "string",
        },
        skills: {
          type: "string[]",
          required: true,
          defaultValue: "[]",
        },
        interests: {
          type: "string[]",
          required: true,
          defaultValue: "[]",
        },
      },
    },
  }),
);

export const auth = getAuthConfig();
