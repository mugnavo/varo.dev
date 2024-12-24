import { tool } from "ai";
import { and, cosineDistance, eq, gt, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { user, userEmbedding } from "~/lib/server/db/schema";
import { SessionUser } from "../auth";
import { db } from "../db";
import { generateEmbedding } from "./embedding";

export function getTools(currentUser: SessionUser) {
  const searchDevelopers = tool({
    description: `Search for developers in the platform based on the user's prompt.`,
    parameters: z.object({
      query: z.string().describe("The user's search query."),
    }),

    execute: async (params) => {
      const embeddedQuery = await generateEmbedding(params.query);

      const userSimilarity = sql<number>`1 - (${cosineDistance(
        userEmbedding.embedding,
        embeddedQuery,
      )})`;

      const matchUsers = await db
        .selectDistinctOn([userEmbedding.user_id], {
          embedding_similarity: userSimilarity,
          embedding_content: userEmbedding.content,
          id: userEmbedding.user_id,
          name: user.name,
          username: user.username,
          avatar_url: user.avatar_url,
          location: user.location,
          bio: user.bio,
          skills: user.skills,
          interests: user.interests,
          availability: user.availability,
          experience_level: user.experience_level,
          match_user: user.match_user,
          match_project: user.match_project,
          ideaOrProject: user.ideaOrProject,
        })
        .from(userEmbedding)
        .innerJoin(user, eq(userEmbedding.user_id, user.id))
        .where(
          and(
            gt(userSimilarity, 0.6),
            ne(userEmbedding.user_id, currentUser.id),
            eq(user.match_user, true),
          ),
        )
        .limit(5);

      return {
        developers: matchUsers,
      };
    },
  });

  const searchProjects = tool({
    description: `Search for projects in the platform based on the user's prompt.`,
    parameters: z.object({
      query: z.string().describe("The user's search query."),
    }),

    execute: async (params) => {
      console.log("calling searchProjects");
      console.log(params);

      return { projects: params };
    },
  });

  return { searchDevelopers, searchProjects };
}

export type SearchDevelopersReturnType = Awaited<
  ReturnType<ReturnType<typeof getTools>["searchDevelopers"]["execute"]>
>;
export type SearchProjectsReturnType = Awaited<
  ReturnType<ReturnType<typeof getTools>["searchProjects"]["execute"]>
>;
