import { convertToCoreMessages, streamText } from "ai";
import { eq } from "drizzle-orm";
import { users } from "~~/server/schemas";
import { chatModel } from "~~/server/utils/ai";
import { updateProfile } from "~~/server/utils/tools";

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);

	// get user data
	const userData = await db.query.users.findFirst({ where: eq(users.id, user.id) });

	if (!userData) {
		return createError("User not found");
	}

	const { messages } = await readBody(event);

	const systemPrompt = userData.embedding
		? `Use the provided tools/functions accordingly, and respond with "I can't assist you with that" if the user asks about something irrelevant to the platform.`
		: `The user hasn't setup their profile yet. If the user provides more information about themselves, call 'updateProfile' update their profile. Otherwise, force the user to provide more information about themselves and what they're looking for in the platform.`;

	const result = await streamText({
		model: chatModel,
		system:
			`You are an assistant for Varo.dev, a matchmaking platform for developers, open-source projects, and indie founders where users can match with other users, or with projects. Keep your responses short and concise. ` +
			systemPrompt,
		tools: userData.embedding
			? {
					updateProfile,
					// ... add more tools here as needed, since the user has already setup their profile
				}
			: { updateProfile },

		messages: convertToCoreMessages(messages),
	});

	return result.toDataStreamResponse();
});
