import { redirect } from "@tanstack/react-router";
import { createServerFn, json } from "@tanstack/start";
import { and, cosineDistance, eq, gt, ne, or, sql } from "drizzle-orm";
import { z } from "zod";

import { authMiddleware } from "~/middleware/auth-guard";
import { generateEmbeddings } from "~/server/ai/embedding";
import { db, table } from "~/server/db";

export const userProfileSchema = z.object({
  name: z.string().min(1, "Name is required.").describe("User's name"),
  username: z.string().min(1, "Username is required.").describe("User's username"),
  match_user: z
    .boolean()
    .default(true)
    .describe("Whether the user wants to match with other users. True by default."),
  match_project: z
    .boolean()
    .default(true)
    .describe("Whether the user wants to match with projects. True by default."),

  bio: z.string().optional().describe("User's bio or description"),
  location: z.string().optional().describe("User's location"),
  experience_level: z
    .number()
    .min(1)
    .max(3)
    .describe("User's experience level, ranging from 1 (beginner) to 3 (expert)"),
  availability: z
    .number()
    .min(1)
    .max(3)
    .describe(
      "User's availability, ranging from 1 (least available/volunteer) to 3 (available full-time)",
    ),

  skills: z
    .string()
    .array()
    .min(1, "Enter at least 1 skill.")
    .describe("Array of user's skills"),
  interests: z
    .string()
    .array()
    .min(1, "Enter at least 1 interest.")
    .describe("Array of user's interests"),
});

export const setupProfile = createServerFn({ method: "POST" })
  .validator(userProfileSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: profile, context }) => {
    // TODO:
    // - prevent inserting duplicate matches?
    // ^ or is this only possible if the user updates their profile?
    //   this is the initial setup, so it should be fine since we're deleting existing matches

    const { user } = context;

    try {
      const chunks = [
        ...profile.skills,
        ...profile.interests,
        // last chunk should be a combination of both
        `${profile.skills.join(" ")} ${profile.interests.join(" ")}`,
      ];

      console.log("Chunk length: ", chunks.length);
      console.log("Last chunk: ", chunks[chunks.length - 1]);

      if (chunks.length) {
        const embeddings = await generateEmbeddings(chunks);
        console.log("Embeddings length: ", embeddings.length);
        console.log(
          "Last embedding content: ",
          embeddings[embeddings.length - 1].content,
        );
        await db.transaction(async (tx) => {
          console.log("Deleting existing embeddings and pending matches...");
          // delete existing embeddings
          await tx
            .delete(table.userEmbedding)
            .where(eq(table.userEmbedding.user_id, user.id));

          // delete any pending matches
          await tx
            .delete(table.userMatch)
            .where(
              and(
                or(
                  eq(table.userMatch.user1_id, user.id),
                  eq(table.userMatch.user2_id, user.id),
                ),
                and(
                  ne(table.userMatch.user1_status, "accepted"),
                  ne(table.userMatch.user2_status, "accepted"),
                ),
              ),
            );
          await tx
            .delete(table.projectMatch)
            .where(
              and(
                eq(table.projectMatch.user_id, user.id),
                ne(table.projectMatch.project_status, "accepted"),
                ne(table.projectMatch.user_status, "accepted"),
              ),
            );

          console.log("Inserting new embeddings...");
          // insert new embeddings excluding the last one
          await tx
            .insert(table.userEmbedding)
            .values(embeddings.slice(0, -1).map((e) => ({ user_id: user.id, ...e })));

          // look for new matches using the last embedding
          if (profile.match_user) {
            console.log("Looking for new user matches...");
            const user_similarity = sql<number>`1 - (${cosineDistance(
              table.userEmbedding.embedding,
              embeddings[embeddings.length - 1].embedding,
            )})`;

            try {
              const matchUsers = await tx
                .selectDistinctOn([table.userEmbedding.user_id], {
                  name: table.userEmbedding.content,
                  user_similarity,
                  user_id: table.userEmbedding.user_id,
                })
                .from(table.userEmbedding)
                .innerJoin(table.user, eq(table.userEmbedding.user_id, user.id))
                .where(
                  and(
                    gt(user_similarity, 0.5),
                    ne(table.userEmbedding.user_id, user.id),
                    eq(table.user.match_user, true),
                  ),
                )
                .limit(10);

              if (matchUsers.length) {
                console.log(`Inserting ${matchUsers.length} new user matches...`);
                // insert new matches
                await tx.insert(table.userMatch).values(
                  matchUsers.map((m) => ({
                    user1_id: user.id,
                    user2_id: m.user_id,
                    user1_status: "pending" as const,
                    user2_status: "pending" as const,
                  })),
                );
              } else {
                console.log("No user matches found.");
              }
            } catch (error) {
              console.log("Error while setting up user matches: ", error);
            }
          }

          if (profile.match_project) {
            console.log("Looking for new project matches...");
            const projectSimilarity = sql<number>`1 - (${cosineDistance(
              table.projectEmbedding.embedding,
              embeddings[embeddings.length - 1].embedding,
            )})`;

            try {
              const matchProjects = await tx
                .selectDistinctOn([table.projectEmbedding.project_id], {
                  name: table.projectEmbedding.content,
                  projectSimilarity,
                  project_id: table.projectEmbedding.project_id,
                })
                .from(table.projectEmbedding)
                .innerJoin(
                  table.project,
                  eq(table.projectEmbedding.project_id, table.project.id),
                )
                .where(
                  and(gt(projectSimilarity, 0.5), eq(table.project.match_enabled, true)),
                )
                .limit(10);

              if (matchProjects.length) {
                console.log(`Inserting ${matchProjects.length} new project matches...`);
                // insert new matches
                await tx.insert(table.projectMatch).values(
                  matchProjects.map((m) => ({
                    user_id: user.id,
                    project_id: m.project_id,
                    user_status: "pending" as const,
                    project_status: "pending" as const,
                  })),
                );
              } else {
                console.log("No project matches found.");
              }
            } catch (error) {
              console.log("Error while setting up project matches: ", error);
            }
          }
        });
      }

      await db
        .update(table.user)
        .set({ ...profile, setup_at: new Date() })
        .where(eq(table.user.id, user.id));

      // return json({
      //   success: true,
      //   message: "Setup successful. Welcome to Varo.",
      // });
    } catch (error) {
      console.log(error);
      return json({
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }

    throw redirect({ to: "/app" });
  });
