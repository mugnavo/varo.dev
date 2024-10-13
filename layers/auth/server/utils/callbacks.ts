import { z } from "zod";

type GithubHandlerConfig = Parameters<typeof defineOAuthGitHubEventHandler>[0];
type GithubOnSuccessHandler = GithubHandlerConfig["onSuccess"];

export const GithubSuccessEventHandler = (handler: GithubOnSuccessHandler) => {
	const bodySchema = z.object({
		tokens: z.record(z.string(), z.any()),
		user: z.record(z.string(), z.any()),
	});

	return defineEventHandler(async (event) => {
		// Validate the event body
		const { data, error } = await readValidatedBody(event, (body) =>
			bodySchema.safeParse(body),
		);

		if (error) {
			throw createError({ message: "Invalid payload received", statusCode: 400 });
		}

		try {
			await handler(event, data);
		} catch (e) {
			const err = e as Error;
			console.error(`Github Success Callback Error: ${err.name}`, e);
		}
	});
};

type GithubOnFailureHandler = Exclude<GithubHandlerConfig["onError"], undefined>;

export const GithubFailureEventHandler = (handler: GithubOnFailureHandler) => {
	return defineEventHandler(async (event) => {
		//TODO: Properly type the error for typesafety
		const body = await readBody(event);
		await handler(event, body);
	});
};
