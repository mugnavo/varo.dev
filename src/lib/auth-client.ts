import type { BetterAuthClientPlugin } from "better-auth";
import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { varoAuthPlugin } from "./server/auth-plugins";

const varoAuthClientPlugin = () => {
  return {
    id: "varoAuthPlugin",
    $InferServerPlugin: {} as ReturnType<typeof varoAuthPlugin>,
  } satisfies BetterAuthClientPlugin;
};

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
  plugins: [usernameClient(), varoAuthClientPlugin()],
});

export default authClient;
