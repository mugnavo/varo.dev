import { readBody } from "@tanstack/react-start/server";
import { convertToCoreMessages, streamText } from "ai";
import { chatModel } from "~/lib/ai/models";
import { getTools } from "~/lib/ai/tools";
import { auth } from "~/lib/auth";

export const ServerRoute = createServerFileRoute().methods({
  POST: async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages } = await readBody();

    const result = streamText({
      temperature: 0.6,
      model: chatModel,
      system: `You are a matchmaking assistant for Varo, a matchmaking platform to promote collaboration for developers, open-source projects, and indie founders where users can match with other users or projects. You can provide friendly and professional tips related to networking, open-source, or building ventures and communities. Keep your responses concise while remaining friendly and light-hearted. Call the provided tools accordingly and explain the results in detail. If irrelevant to the platform, respond with "I can't assist you with that." with a very short description of your purpose.`,

      tools: getTools(session.user),

      experimental_toolCallStreaming: true,
      maxSteps: 4,

      messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
  },
});
