import { createGoogleGenerativeAI } from "@ai-sdk/google";

const runtimeConfig = useRuntimeConfig();

if (!runtimeConfig.googleGenerativeAiApiKey) {
  throw new Error("Missing NUXT_GOOGLE_GENERATIVE_AI_API_KEY in env");
}

export const google = createGoogleGenerativeAI({
  apiKey: runtimeConfig.googleGenerativeAiApiKey,
});
