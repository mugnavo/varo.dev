import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./server/schemas/*.ts",
  breakpoints: true,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NUXT_DATABASE_URL as string,
  },
} satisfies Config;
