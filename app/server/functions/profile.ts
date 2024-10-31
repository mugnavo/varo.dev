import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().optional().describe("User's name"),
  username: z.string().optional().describe("User's username"),
  match_user: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether the user wants to match with other users. True by default."),
  match_project: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether the user wants to match with projects. True by default."),

  bio: z.string().optional().describe("User's bio or description"),
  location: z.string().optional().describe("User's location"),
  experience_level: z
    .number()
    .min(1)
    .max(5)
    .describe("User's experience level, ranging from 1 (beginner) to 5 (expert)"),
  availability: z
    .number()
    .min(1)
    .max(5)
    .describe(
      "User's availability, ranging from 1 (least available/busy fulltime) to 5 (most available/not busy)",
    ),

  skills: z.string().array().optional().describe("Array of user's skills"),
  interests: z.string().array().optional().describe("Array of user's interests"),
});
