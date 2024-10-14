import { createGoogleGenerativeAI } from "@ai-sdk/google";

const runtimeConfig = useRuntimeConfig();

if (!runtimeConfig.googleGenerativeAiApiKey) {
	throw new Error("Missing NUXT_GOOGLE_GENERATIVE_AI_API_KEY in env");
}

const google = createGoogleGenerativeAI({
	apiKey: runtimeConfig.googleGenerativeAiApiKey,
});

// https://ai.google.dev/gemini-api/docs/models/gemini
// use "gemini-1.5-flash-latest" if this is too dumb
export const chatModel = google("gemini-1.5-flash-latest");

export const embeddingModel = google.textEmbeddingModel("text-embedding-004");
