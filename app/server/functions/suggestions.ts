import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { and, eq, ne, or } from "drizzle-orm";
import { authMiddleware } from "~/middleware/auth-guard";
import { db, table } from "../db";

export const suggestionsQueryOptions = () =>
  queryOptions({
    queryKey: ["suggestions"],
    queryFn: () => getSuggestions(),
  });

const getSuggestions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { user } = context;

    const userSuggestionsQuery = db.query.userMatch.findMany({
      where: and(
        or(eq(table.userMatch.user1_id, user.id), eq(table.userMatch.user2_id, user.id)),
        or(
          eq(table.userMatch.user1_status, "pending"),
          eq(table.userMatch.user2_status, "pending"),
        ),
        and(
          ne(table.userMatch.user1_status, "rejected"),
          ne(table.userMatch.user2_status, "rejected"),
        ),
      ),
      with: {
        user1: true,
        user2: true,
      },
    });

    const projectSuggestionsQuery = db.query.projectMatch.findMany({
      where: and(
        eq(table.projectMatch.user_id, user.id),
        and(
          ne(table.projectMatch.project_status, "accepted"),
          ne(table.projectMatch.user_status, "accepted"),
          ne(table.projectMatch.user_status, "rejected"),
          ne(table.projectMatch.project_status, "rejected"),
        ),
      ),
      with: {
        project: true,
      },
    });

    const [userSuggestions, projectSuggestions] = await Promise.all([
      userSuggestionsQuery,
      projectSuggestionsQuery,
    ]);

    return { users: userSuggestions, projects: projectSuggestions };
  });
