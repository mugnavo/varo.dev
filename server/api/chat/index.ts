import { convertToCoreMessages, streamText } from "ai";
import { google } from "~~/server/utils/ai";

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);

  const result = await streamText({
    // https://ai.google.dev/gemini-api/docs/models/gemini
    // model: google("gemini-1.5-flash-latest"),
    model: google("gemini-1.5-flash-8b-latest"), // use flash-latest if this is too dumb
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
});
