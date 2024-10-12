import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from "../schemas";

const runtimeConfig = useRuntimeConfig();

if (!runtimeConfig.databaseUrl) {
	throw new Error("Missing NUXT_DATABASE_URL in env");
}

const driver = new Pool({ connectionString: runtimeConfig.databaseUrl });

export const db = drizzle(driver, { schema });
