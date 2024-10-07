import GithubProvider from "@auth/core/providers/github";
import type { AuthConfig } from "@auth/core/types";
import { NuxtAuthHandler } from "#auth";

const runtimeConfig = useRuntimeConfig();

// Refer to Auth.js docs for more details
export const authOptions: AuthConfig = {
  secret: runtimeConfig.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.githubClientId,
      clientSecret: runtimeConfig.githubClientSecret,
      profile: async (profile, tokens) => {
        // Perform profile transformations here, and return a User type.
        // If you want to extend the User type, change the user in the types.d.ts

        return {
          id: profile.id.toString(),
          email: profile.email,
          image: profile.avatar_url,
          name: profile.name,
        };
      },
    }),
  ],
};

export default NuxtAuthHandler(authOptions, runtimeConfig);
