import { createGoogleGenerativeAI } from "@ai-sdk/google";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY in env");
}

const google = createGoogleGenerativeAI();

// https://ai.google.dev/gemini-api/docs/models/gemini
export const chatModel = google("gemini-2.0-flash-lite");

export const embeddingModel = google.textEmbeddingModel("text-embedding-004");
