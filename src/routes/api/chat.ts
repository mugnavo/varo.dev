import { createAPIFileRoute } from "@tanstack/react-start/api";
import { readBody } from "@tanstack/react-start/server";
import { convertToCoreMessages, streamText } from "ai";
import { chatModel } from "~/lib/server/ai";
import { getTools } from "~/lib/server/ai/tools";
import { auth } from "~/lib/server/auth";

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages } = await readBody();

    const result = streamText({
      temperature: 0.6,
      model: chatModel,
      system: `You are a friendly matchmaking assistant for Varo; a matchmaking platform for developers, open-source projects, and indie founders where users can match with other users or projects. Keep your responses short and concise. Only respond in plaintext, avoid markdown or code responses. Call the provided tools accordingly and explain the results in detail. Respond with "I can't assist you with that" if irrelevant to the platform.`,

      tools: getTools(session.user),

      experimental_toolCallStreaming: true,
      maxSteps: 4,

      messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
  },
});
