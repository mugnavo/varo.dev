import { z } from "zod";

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
