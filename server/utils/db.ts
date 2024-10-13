import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "../schemas";

const runtimeConfig = useRuntimeConfig();

if (!runtimeConfig.databaseUrl) {
	throw new Error("Missing NUXT_DATABASE_URL in env");
}

const driver = new pg.Pool({ connectionString: runtimeConfig.databaseUrl });

export const db = drizzle(driver, { schema });
