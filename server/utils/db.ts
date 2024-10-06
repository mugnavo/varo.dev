import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schemas";

const driver = postgres(process.env.DATABASE_URL as string);

export const db = drizzle(driver, { schema });
