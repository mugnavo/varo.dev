import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({
    headers,
    query: {
      // for setup_at field in user table to take effect immediately after initial setup
      disableCookieCache: true,
    },
  });

  return session?.user || null;
});
