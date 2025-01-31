import { convertToCoreMessages, streamText } from "ai";
import { eq } from "drizzle-orm";
import { users } from "~~/server/schemas";
import { chatModel } from "~~/server/utils/ai";
import { getTools } from "~~/server/utils/tools";

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);

	// get user data
	const userData = await db.query.users.findFirst({ where: eq(users.id, user.id) });

	if (!userData) {
		return createError("User not found");
	}

	const { messages } = await readBody(event);

	const systemPrompt = `Call the provided tools accordingly, and respond with "I can't assist you with that" if the user asks about something irrelevant to the platform.`;

	const result = await streamText({
		temperature: 0.6,
		model: chatModel,
		system:
			`You are a matchmaking assistant for Varo; a matchmaking platform for developers, open-source projects, and indie founders where users can match with other users, or with projects. Keep your responses short and concise. Only respond in plaintext, avoid markdown or code responses. ` +
			systemPrompt,
		tools: getTools(user),

		experimental_toolCallStreaming: true,
		maxSteps: 4,

		messages: convertToCoreMessages(messages),
	});

	return result.toDataStreamResponse();
});
