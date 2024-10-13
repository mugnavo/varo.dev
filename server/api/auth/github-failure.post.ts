import { GithubFailureEventHandler } from "~~/layers/auth/server/utils/callbacks";

export default GithubFailureEventHandler(async (event, error) => {
	console.error("GitHub OAuth error:", error);
	return sendRedirect(event, "/");
});
