import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schemas";

const runtimeConfig = useRuntimeConfig();

const driver = postgres(runtimeConfig.databaseUrl);

export const db = drizzle(driver, { schema });
