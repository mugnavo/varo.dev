import type { BetterAuthPlugin } from "better-auth";

export const varoAuthPlugin = () =>
  ({
    id: "varoAuthPlugin",
    schema: {
      user: {
        fields: {
          setup_at: {
            type: "date",
          },
          terms_accepted_at: {
            type: "date",
          },
          match_user: {
            type: "boolean",
            required: true,
            defaultValue: true,
          },
          match_project: {
            type: "boolean",
            required: true,
            defaultValue: true,
          },
          bio: {
            type: "string",
          },
          location: {
            type: "string",
          },
          experience_level: {
            type: "number",
          },
          availability: {
            type: "number",
          },
          idea_or_project: {
            type: "string",
          },
          // skills: {
          //   type: "string[]",
          //   required: true,
          // },
          // interests: {
          //   type: "string[]",
          //   required: true,
          // },
        },
      },
    },
  }) satisfies BetterAuthPlugin;
