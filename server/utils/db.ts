import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schemas";

const runtimeConfig = useRuntimeConfig();

if (!runtimeConfig.databaseUrl) {
	throw new Error("Missing NUXT_DATABASE_URL in env");
}

const driver = postgres(runtimeConfig.databaseUrl);

export const db = drizzle(driver, { schema });
