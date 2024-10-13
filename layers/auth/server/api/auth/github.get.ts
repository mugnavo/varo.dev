import { DEFAULT } from "~~/layers/auth/constants/urls";

const runtimeConfig = useRuntimeConfig();

export default defineOAuthGitHubEventHandler({
	config: {
		emailRequired: true,
	},
	async onSuccess(event, payload) {
		const endpoint = runtimeConfig?.callbacks?.github?.success;
		const fallback = DEFAULT.GITHUB_SUCCESS;

		$fetch(endpoint || fallback, { method: "POST", body: payload });
	},
	// Optional, will return a json error and 401 status code by default
	onError(event, error) {
		const endpoint = runtimeConfig?.callbacks?.github?.failure;
		const fallback = DEFAULT.GITHUB_FAILURE;

		$fetch(endpoint || fallback, { method: "POST", body: error.toJSON() });
	},
});
