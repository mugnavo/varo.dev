import { GoogleGenerativeAI } from "@google/generative-ai";
import { generate_sequence } from "~/constants/prompt";

// TODO: Add an adapter layer for multiple LLM services
export const useGenAi = async (
    modelType: "gemini-pro" | "gemini-1.5-flash" | "gemini-1.5-flash-002"
) => {
    const apikey = import.meta.env.VITE_GEMINI_API;
    if (!apikey) throw new Error(`No GEMINI API provided`);

    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({
        model: modelType,
        systemInstruction: generate_sequence(),
        generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        },
    });

    return model;
};
