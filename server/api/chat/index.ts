import { convertToCoreMessages, streamText } from "ai";
import { google } from "~~/server/utils/ai";

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);

  const result = await streamText({
    model: google("gemini-1.5-flash-latest"),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
});
